#!/bin/bash
# Check if /verify-2fa redirects to /login when no session is present

echo "Checking access to /verify-2fa without session..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/verify-2fa)

if [ "$RESPONSE" == "307" ] || [ "$RESPONSE" == "308" ]; then
  echo "PASS: /verify-2fa redirected (Status: $RESPONSE)"
elif [ "$RESPONSE" == "200" ]; then
  echo "FAIL: /verify-2fa is accessible without login (Status: 200)"
  echo "NOTE: If you haven't rebuilt the app, changes won't apply."
else
  echo "UNKNOWN: Status $RESPONSE"
fi
