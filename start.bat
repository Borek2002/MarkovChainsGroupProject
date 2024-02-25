@echo off


cd MarkovChainsFrontend\


echo Uruchamianie aplikacji Angular...
start ng serve --open

timeout /t 10 /nobreak >nul

rem Przejście do katalogu z projektem Java
cd ..
cd MarkovChainsBackend\


echo Uruchamianie projektu Java...
mvn spring-boot:run
