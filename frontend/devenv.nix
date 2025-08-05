{ pkgs, ... }:
{
  packages = [
    pkgs.cypress
    pkgs.lightningcss
  ];

  tasks = {
    "bash:frontend:install" = {
      exec = ''
        if [[ ! -e frontend/node_modules ]]; then
          make -C frontend install
        fi
      '';
      before = [
        "devenv:enterShell"
      ];
    };
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs;
    pnpm = {
      enable = true;
      package = pkgs.pnpm;
    };
  };

  enterShell = ''
    export CYPRESS_CRASH_REPORTS=0
    export CYPRESS_RUN_BINARY=${pkgs.cypress}/opt/cypress/Cypress
    export CYPRESS_SKIP_VERIFY=true
  '';
}
