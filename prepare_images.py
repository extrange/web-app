import shutil
import subprocess
from pathlib import Path

import xxhash

NEW_IMAGES_PATH = Path('D:/desktop/new_images')
BG_FOLDER = Path('public/bg')
TEMP_FOLDER = Path('temp')


def main(path=NEW_IMAGES_PATH):
    """
    Very clunky. Rewrite this in JS, importing the Squoosh library directly.
    Also resize larger images to 1920 max
    Better duplicate image detection
    :param path:
    :return:
    """
    if TEMP_FOLDER.exists():
        raise Exception(f'{TEMP_FOLDER} already exists')

    if not NEW_IMAGES_PATH.exists():
        raise Exception(f'{NEW_IMAGES_PATH} does not exist')

    TEMP_FOLDER.mkdir()
    hashes = set()
    current_filename = 1

    # Clear bg folder
    for pic in BG_FOLDER.iterdir():
        pic.unlink()
        print(f'Removed {pic.name}')

    # Iterate through new images and convert
    for pic in NEW_IMAGES_PATH.iterdir():
        # Calculate file hash
        with pic.open('rb') as f:
            hash = xxhash.xxh3_64_hexdigest(f.read())

        if hash in hashes:
            print(f'Duplicate image: {pic.name}')
            continue

        hashes.add(hash)
        print(f'{pic} added ({hash})')
        subprocess.call([r'C:\Program Files\nodejs\squoosh-cli.cmd',
                         '--mozjpeg', '{}',
                         '-d', TEMP_FOLDER.absolute(),
                         pic
                         ])
        print(f'Converted {pic}')

        shutil.move(TEMP_FOLDER / f'{pic.stem}.jpg', BG_FOLDER / f'{current_filename}.jpg')
        current_filename += 1

    shutil.rmtree(TEMP_FOLDER)


if __name__ == '__main__':
    main(NEW_IMAGES_PATH)
