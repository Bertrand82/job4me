@echo off
setlocal enabledelayedexpansion

echo.
echo  ng build github base job4you-78ed0 ===
CALL ng build --output-path docsTemp --base-href /job4you-78ed0/
CALL ng build
echo  ng build 
CALL ng build 
echo  xcopy done 
echo  xcopy github
CALL xcopy "" 
CALL xcopy "docsTemp\browser" "docs" /E /I /H /Y

CALL firebase deploy --only hosting
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] deploy a échoué.
    goto fin
)
echo.
echo === YES It is deployed   ===
goto end
:fin
echo WARNING !!!! deploy n'est pas arrivé à la fin
endlocal
:end
echo https://job4you-78ed0.web.app/

pause
