{
  pkgs,
  ...
}:

{
  cachix.enable = false;

  # https://devenv.sh/packages/
  packages = with pkgs; [
    biome
  ];

  languages.javascript = {
    enable = true;
  };
}
