# KANELO na Raspberry Pi z Home Assistant OS

Na Home Assistant OS nie ma `apt`, więc strona działa jako lokalny dodatek **KANELO Web**
(nginx, port 8080). Pliki strony leżą w `/share/kanelo`, a buduje je skrypt `ha-setup.sh`
uruchamiany w dodatku **Terminal & SSH**.

## Instalacja

1. W terminalu HA wklej:
   ```bash
   curl -fsSL https://raw.githubusercontent.com/kszyysiek/grarzynka/claude/intelligent-faraday-qyy48m/deploy/homeassistant/ha-setup.sh | bash
   ```
   Budowanie trwa kilka minut.
2. Skrypt sam instaluje i uruchamia dodatek. Gdyby się nie udało: **Ustawienia → Dodatki → Sklep z dodatkami → ⋮ → Sprawdź aktualizacje**.
   Na dole pojawi się sekcja **Local add-ons** → **KANELO Web** → **Zainstaluj** → **Uruchom**.
3. Strona: `http://<IP Home Assistanta>:8080/`, np. `http://homeassistant.local:8080/`.

## Aktualizacja

Wklej tę samą komendę co w kroku 1. Dodatku nie trzeba restartować.

## Publiczny adres

Dodatek **Cloudflared** (repozytorium `https://github.com/brenner-tobias/ha-addons`)
z własną domeną w Cloudflare. W jego konfiguracji dodaj w `additional_hosts`:
hostname `www.twojadomena.pl`, service `http://local-kanelo-web:80`.
