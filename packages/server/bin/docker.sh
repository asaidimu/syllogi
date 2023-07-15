#!/usr/bin/env sh

IMAGE_NAME="syllogi_server"
CONTAINER_NAME="syllogi_server_app"
NETWORK_NAME="syllogi_network"

_buildImage() {
  cd ../../
  yarn docker-ctx -p '@syllogi/server' -c packages/server/Dockerfile \
    | docker buildx build --build-arg PACKAGE_NAME='@syllogi/server' \
    --no-cache \
    - -t ${IMAGE_NAME}
}

_startContainer() {
  docker images | grep -q ${IMAGE_NAME} || _buildImage
  docker compose up -d
}

help(){
cat <<EOF
$(bold ABOUT)
    ${SCRIPT_NAME}

$(bold USAGE)
    ${SCRIPT_NAME} [flag]

$(bold options)
    -h  --help         show help
EOF
}

main(){
  opt="$1"
  [ "$#" -gt 0 ] && shift
  case "$opt" in
    -h | --help)
      help
    ;;
    --image)
      _buildImage
      ;;
    --container)
      _startContainer
      ;;
  esac
}

bold(){
  printf "\033[1;37;48m${@}\033[0m";
}
bold_blue(){
  printf "\033[1;34;48m${@}\033[0m";
}
bold_cyan(){
  printf "\033[1;36;48m${@}\033[0m";
}
bold_green(){
  printf "\033[1;32;48m${@}\033[0m";
}
bold_grey(){
  printf "\033[1;30;48m${@}\033[0m";
}
bold_red(){
  printf "\033[1;31;48m${@}\033[0m";
}
bold_yellow(){
  printf "\033[1;33;48m${@}\033[0m";
}
blue(){
  printf "\033[0;34;48m${@}\033[0m";
}
cyan(){
  printf "\033[0;36;48m${@}\033[0m";
}
green(){
  printf "\033[0;32;48m${@}\033[0m";
}
grey(){
  printf "\033[0;37;48m${@}\033[0m";
}
red(){
  printf "\033[0;31;48m${@}\033[0m";
}
yellow(){
  printf "\033[0;33;48m${@}\033[0m";
}
header(){
  printf "\033[35m${@}\033[0m";
}
underline(){
  printf "\033[4m${@}\033[0m";
}
_repl() { printf "$1"'%.s' $(eval "echo {1.."$(($2))"}"); }
_label(){
  color="$1"
  level="$2"
  size=$(printf "$level" | wc -m)
  size=$((6 - size))
  printf "[$(bold `date +%H:%M:%S`)]$($color "$(_repl " " $size)${level} │") "
}

_log(){
  _label bold_green "LOG"
  echo "${@}"
}
_alert() {
  _label bold_yellow "ALERT"
  echo "${@}"
}
_error(){
  _label bold_red "ERROR"
  echo "${@}"
}
_trace(){
  _label bold_cyan "TRACE"
  echo "${@}"
}
_debug(){
  _label bold_blue "DEBUG"
  echo "${@}"
}

export SCRIPT_NAME=$(basename $0)
main $@
