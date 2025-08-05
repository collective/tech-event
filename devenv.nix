{ pkgs, config, ... }:
{
  dotenv.enable = true;

  services.caddy = {
    enable = true;
    config = ''
      {
        admin off
      }
      :8000 {
        reverse_proxy /ws* localhost:3001
        handle_path "/++razzle++*" {
          rewrite * /++razzle++{uri}
          reverse_proxy localhost:3001
        }
        handle_path "/++api++*" {
          rewrite * /VirtualHostBase/https/${config.env.CODESPACE_NAME}-8000.${config.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}:443/Plone/++api++/VirtualHostRoot{uri}
          reverse_proxy localhost:8080
        }
        handle_path "/api*" {
          rewrite * /VirtualHostBase/https/${config.env.CODESPACE_NAME}-8000.${config.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}:443/Plone/VirtualHostRoot/_vh_api{uri}
          reverse_proxy localhost:8080
        }
        reverse_proxy http://localhost:3000
      }
    '';
  };

  processes = {
    backend.exec = "make -C backend start";
    frontend.exec = "make -C frontend start";
  };

  process.managers.process-compose.settings.environment = [
    "RAZZLE_INTERNAL_API_PATH=http://localhost:8080/VirtualHostBase/https/${config.env.CODESPACE_NAME}-8000.${config.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}:443/Plone/VirtualHostRoot"
    "RAZZLE_API_PATH=https://${config.env.CODESPACE_NAME}-8000.${config.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    "CLIENT_PUBLIC_PATH=https://${config.env.CODESPACE_NAME}-8000.${config.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/++razzle++"
  ];

  # See full reference at https://devenv.sh/reference/options/
}
