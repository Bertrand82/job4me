echo starting firebase emulators...
try {
  firebase emulators:start
  echo Firebase emulators started.
} catch {
  echo Firebase emulators failed to start.
  pause
}

pause
