{ pkgs, ... }:
{
  packages = [
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
}
