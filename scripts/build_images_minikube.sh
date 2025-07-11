#!/bin/bash

# Initialize variables with default values
TAG="v0.0.0"
IMAGE_NAME_PREFIX="task-manager"
SERVICES="api,worker,client"

# Parse command-line options
while getopts ":p:t:s:" opt; do
  case $opt in
    t)
      TAG="$OPTARG"
      ;;
    s)
      SERVICES="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

if ! minikube status; then
  echo "Minikube is not running. Follow the README in overlay/minikube to start it."
  exit 1
fi

SERVICES_PATHS=()

# Parse -s flag
IFS="," read -ra ARR <<< $SERVICES
for service in ${ARR[@]}; do
  if [[ $service == "api" ]] ; then
    SERVICES_PATHS+=("api")
  elif [[ $service == "worker" ]] ; then
    SERVICES_PATHS+=("worker")
  elif [[ $service == "client" ]] ; then
    SERVICES_PATHS+=("client")
  else
    echo "Error: invalid service found in value provided for -s flag: "$service""
    echo "  Value should be a comma separated list of the following services : api, worker or client"
    echo "  Ex: -s api,worker"
    exit 1
  fi
done

# Use minikube docker daemon
eval $(minikube docker-env)

# Navigate to apps directory
cd ../apps

# Build needed images locally
for path in "${SERVICES_PATHS[@]}"; do
    cd $path
    docker build -t $IMAGE_NAME_PREFIX/$path:$TAG .
    cd ..
done

# Navigate back to initial directory
cd scripts

# Unset env variable needed to use minikube docker daemon
minikube docker-env --unset