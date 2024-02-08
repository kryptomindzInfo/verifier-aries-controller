#!/bin/bash
ENDPOINT=http://159.89.11.173:8040
SEED=kcoders_verifier0000000000000000
curl -d "{\"seed\":\"$SEED\", \"role\":\"ENDORSER\", \"alias\":\"verifier.kcoders\"}" -X POST http://dev.greenlight.bcovrin.vonx.io/register -H "Content-Type: application/json"
docker run -d --rm -ti \
    --name verifier \
    -p 8040-8049:8040-8049 \
    -v "/home/$(whoami)/.aries/logs:/home/aries/logs" \
    bcgovimages/aries-cloudagent:py3.9-indy-1.16.0_0.10.0-rc0 start \
    --wallet-type askar \
    --seed $SEED \
    --wallet-key secretOfVerifier \
    --wallet-name Verifier \
    --genesis-url http://dev.greenlight.bcovrin.vonx.io/genesis \
    --inbound-transport http 0.0.0.0 8040 \
    --outbound-transport http \
    --admin 0.0.0.0 8041 \
    --admin-insecure-mode \
    --endpoint $ENDPOINT \
    --auto-accept-requests \
    --label 'Identity Validation Hub' \
    --auto-ping-connection \
    --auto-respond-messages \
    --preserve-exchange-records \
    --trace-target log \
    --trace-tag acapy.events \
    --trace-label verifier.agent.trace \
    --auto-accept-invites \
    --auto-accept-requests \
    --auto-store-credential \
    --auto-provision \
    --auto-verify-presentation \
    --debug-connections
