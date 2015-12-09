# tikz.js

[![npm version](https://badge.fury.io/js/tikz.js.svg)](https://badge.fury.io/js/tikz.js)

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

## API for Build Integration

Besides the obvious way of using the CLI for triggering the compilation process, the project also comes with a very small API. Actually, the CLI only wraps the API.

```js
var conversion = tikz({
  input: 'drawing.tikz',
  mode: 'png',
});

conversion.on('done', function (output) {
  console.log('File %s produced!', output);
});

conversion.start();
```

There are many more options and events. The most important ones are all used in the CLI wrapper. Currently, the only exposed function is `start`. It starts the transformation process(es).

## Why ?

A good answer would be "Why not?". In my opinion TikZ is one of the best applications to use programming for drawing high-quality graphics, e.g., for publication. Unfortunately, TikZ is only available as a TeX package. This drawback, however, is also one of the best reasons to prefer using TikZ over other (TeX-decoupled) solutions. It means that the best available typesetting capabilities can be used.

I wanted a solution that uses the best parts of TeX (thus requiring / depending on TeX), while giving me a simple command line utility ready for compiling small dedicated files. The tool should be simple enough to be used in any kind of build system (possibly as a pre- or post-process).

Why did I choose Node.js and not Bash, Python, ...? In my opinion the key differentiator lies in the NPM eco-system. Yes, Python has PIP (or other solutions), but there are a few convenience utilities that render working with NPM / Node.js joyful. Besides, I am relying on a bunch of handy modules that have already been released.

So long answer short: I need a tool that can be invoked from the command line (or via some API) that wires together some other program invocations to produce a graphics output from a file only containing valid TikZ code. In the best case others will find this tool useful as well.

## License

The MIT License (MIT)

Copyright (c) 2015 Florian Rappl

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
