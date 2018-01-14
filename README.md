# Picture Viewer

A simple NodeJS-based web application to display images from the file system.

## Install and run

```
npm install -g @xmartin/picture-viewer
```

will setup a global executable so you can just run

```
picture-viewer
```

or from source:

```
cd picture-viewer
npm install
./bin/picture-viewer
```

## Usage

```
Usage: picture-viewer [options] <dir ...>


  Options:

    -r, --recursive         walk through directory/ies recursively
    -i, --ignore [pattern]  file path pattern to ignore (regex)
    -h, --help              output usage information
```

Open `http://localhost:9876` in a browser.

### Keyboard navigation

* *Left arrow and right arrow* to navigate
* *Space* for random next image
* *Backspace* to go back in history
* *i* to toggle display of path information of the current image
