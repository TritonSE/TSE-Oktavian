#!/bin/bash

backend='localhost:8000'

content_type_json='Content-Type: application/json; charset=utf-8'

dev_creds='{"email": "developer@example.com", "password": "password"}'
pres_creds='{"email": "president@example.com", "password": "password"}'

function get_login() {
	curl --silent -H "${content_type_json}" -d "${1}" "${backend}/api/auth/login"
}

function jqr() {
	jq -r "${2}" <<< "${1}"
}

function get_token() {
	jqr "${1}" '.token'
}

dev_login="$(get_login "${dev_creds}")"
pres_login="$(get_login "${pres_creds}")"

dev_token="$(get_token "${dev_login}")"
pres_token="$(get_token "${pres_login}")"

dev_role_id="$(jqr "${dev_login}" '.user.role._id')"

function curl_json() {
	local cmd=(curl --silent -H "${content_type_json}" "${@}")
	echo 'Request:'
	echo "${cmd[@]@Q}"

	echo 'Response:'
	"${cmd[@]}"
	echo

	echo
}

function get_all_roles() {
	curl_json -H "Authorization: Bearer ${1}" "${backend}/api/roles"
}

function edit_role() {
	curl_json -X PUT -H "Authorization: Bearer ${1}" -d "${2}" "${backend}/api/roles"
}

function create_role() {
	curl_json -H "Authorization: Bearer ${1}" -d "${2}" "${backend}/api/roles"
}

function delete_role() {
	curl_json -X DELETE -H "Authorization: Bearer ${1}" "${backend}/api/roles/${2}"
}

echo "Should succeed: get all roles"
get_all_roles "${dev_token}"

echo "Should succeed: give Developer final approval permissions"
edit_role "${pres_token}" "{\"_id\": \"${dev_role_id}\", \"permissions\": { \"final_approval\": true } }"

echo "Should succeed: remove Developer roster permissions"
edit_role "${pres_token}" "{\"_id\": \"${dev_role_id}\", \"permissions\": { \"roster\": false } }"

echo "Should succeed: rename Developer role to Code Monkey"
edit_role "${pres_token}" "{\"_id\": \"${dev_role_id}\", \"name\": \"Code Monkey\"}"

echo "Should fail: rename role without specifying _id"
edit_role "${pres_token}" "{\"name\": \"Code Monkey\"}"

echo "Should succeed: create Faculty Advisor role"
create_role "${pres_token}" "{\"name\": \"Faculty Advisor\", \"permissions\": { \"roster\": true } }"

echo "Should fail: create role with the same name"
create_role "${pres_token}" "{\"name\": \"Faculty Advisor\", \"permissions\": { \"roster\": true } }"

echo "Should fail: create role without a name"
create_role "${pres_token}" "{\"permissions\": { \"roster\": true } }"

echo "Should fail: developer cannot edit a role"
edit_role "${dev_token}" "{\"_id\": \"${dev_role_id}\", \"name\": \"Best Role\"}"

echo "Should fail: developer cannot create a role"
create_role "${dev_token}" "{\"name\": \"VP Free Food\", \"permissions\": { \"roster\": true } }"

echo "Should fail: developer cannot delete a role"
delete_role "${dev_token}" "${dev_role_id}"

echo "Should succeed: delete the Developer role (who needs them anyway?)"
delete_role "${pres_token}" "${dev_role_id}"

echo "Developer account should not have a role anymore (should be null)"
jqr "$(get_login "${dev_creds}")" '.user.role'
