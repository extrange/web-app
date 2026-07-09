{
  pkgs,
  ...
}:

{
  # https://devenv.sh/packages/
  packages = with pkgs; [
    biome
  ];

  languages.javascript = {
    enable = true;
    corepack.enable = true;
    pnpm.enable = true;
    pnpm.install.enable = true;
  };
}
