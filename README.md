# tikz.js

tikz.js enables the creation of standalone graphics based on PGF/TikZ with the help of LaTeX and ImageMagick. It provides a simple command line tool that handles creation, conversion, and generation of high-quality images using the LaTeX based PGF library with the TikZ API.

## Requirements 

The application is a simple Node.js script that comes with a set of dependencies. All dependencies are resolved and locally installed when running `npm install tikz.js`. It is recommended to install the application globally, i.e., `npm install tikz.js -g`. This will setup a command called `tikz`.

Besides Node.js and npm some external applications may or may not be required.

* LaTeX with packages such as `pgf`, `pgfplots`, or others. The basic template can be changed / selected, which may change the required packages. Besides LaTeX itself there is no hard dependency here. Also the application for the compilation itself (e.g., `pdflatex`) can be changed.
* ImageMagick for eventual conversion from PDF to PNG files (or similar). If you are satisfied with PDF (or EPS) output, then you'll be fine.

There are no more external dependencies.

## Running the Application

In the ideal case the application is invoked via the `tikz` command. A local installation can also be run with `./tikz.js` or `node tikz.js`. There are some command line requirements. At least one argument (input file) has to be supplied.

```bash
tikz source.tikz
```

Please note that the extension *tikz* is just a convention and does not have to be used. You could also name your files *foo.tex*. In the end an output file is generated. You can also change the name of the output file, e.g.,

```bash
tikz source.tikz target.pdf
```

If you want to generate a PNG from the TikZ source you can also use the PNG mode:

```bash
tikz source.tikz target.png -m png
```

The mode is independent from the file name.

## Why ?

TODO

## License

The MIT License (MIT)

Copyright (c) 2015 Florian Rappl

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.