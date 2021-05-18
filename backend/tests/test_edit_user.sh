#!/bin/bash

backend='localhost:8000'

content_type_json='Content-Type: application/json; charset=utf-8'

dev_creds='{"email": "developer@example.com", "password": "password"}'
pres_creds='{"email": "president@example.com", "password": "password"}'

function get_login() {
	curl -H "${content_type_json}" -d "${1}" "${backend}/api/auth/login"
}

function get_token() {
	jq -r '.token' <<< "${1}"
}

function get_id() {
	jq -r '.user._id' <<< "${1}"
}

dev_login="$(get_login "${dev_creds}")"
pres_login="$(get_login "${pres_creds}")"

dev_token="$(get_token "${dev_login}")"
pres_token="$(get_token "${pres_login}")"

dev_id="$(get_id "${dev_login}")"
pres_id="$(get_id "${pres_login}")"

function curl_json() {
	local cmd=(curl -H "${content_type_json}" "${@}")
	echo 'Request:'
	echo "${cmd[@]@Q}"

	echo 'Response:'
	"${cmd[@]}"
	echo

	echo
}

function change_discord() {
	curl_json -X PUT -H "Authorization: Bearer ${1}" -d '{"_id": "'"${2}"'", "discord_username": "'"foo${RANDOM}#1234"'"}' "${backend}/api/users"
}

function change_email() {
	curl_json -X PUT -H "Authorization: Bearer ${1}" -d '{"_id": "'"${2}"'", "email": "'"email${RANDOM}@example.com"'"}' "${backend}/api/users"
}

echo "Should succeed: dev changes own Discord username"
change_discord "${dev_token}" "${dev_id}"

echo "Should fail: dev changes president's Discord username"
change_discord "${dev_token}" "${pres_id}"

echo "Should succeed: president changes dev's Discord username"
change_discord "${pres_token}" "${dev_id}"

echo "Should succeed: president changes own Discord username"
change_discord "${pres_token}" "${pres_id}"

echo "Should fail: dev changes own email"
change_email "${dev_token}" "${dev_id}"

echo "Should fail: dev changes president's email"
change_email "${dev_token}" "${pres_id}"

echo "Should succeed: president changes dev's email"
change_email "${pres_token}" "${dev_id}"

echo "Should succeed: president changes own email"
change_email "${pres_token}" "${pres_id}"
