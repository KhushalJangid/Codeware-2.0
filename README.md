<!-- <div align="center" id="top"> 
  <img src="./.github/app.gif" alt="codeware-2.0" />

  &#xa0;

  <!-- <a href="https://facesearch.netlify.app">Demo</a> 
</div> -->

<h1 align="center">CodeWare 2.0</h1>

<p align="center">
  <img alt="Github top language" src="https://img.shields.io/github/languages/top/KhushalJangid/codeware-2.0?color=56BEB8">

  <img alt="Github language count" src="https://img.shields.io/github/languages/count/KhushalJangid/codeware-2.0?color=56BEB8">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/KhushalJangid/codeware-2.0?color=56BEB8">

  <img alt="License" src="https://img.shields.io/github/license/KhushalJangid/codeware-2.0?color=56BEB8">

  <img alt="Github issues" src="https://img.shields.io/github/issues/KhushalJangid/codeware-2.0?color=56BEB8" />

  <img alt="Github forks" src="https://img.shields.io/github/forks/KhushalJangid/codeware-2.0?color=56BEB8" />

  <img alt="Github stars" src="https://img.shields.io/github/stars/KhushalJangid/codeware-2.0?color=56BEB8" />
</p>

<p align="center">
  <a href="#dart-about">About</a> &#xa0; | &#xa0; 
  <a href="#sparkles-features">Features</a> &#xa0; | &#xa0;
  <a href="#rocket-technologies">Technologies</a> &#xa0; | &#xa0;
  <a href="#white_check_mark-requirements">Requirements</a> &#xa0; | &#xa0;
  <a href="#checkered_flag-starting">Starting</a> &#xa0; | &#xa0;
  <a href="#memo-license">License</a> &#xa0; | &#xa0;
  <a href="https://github.com/KhushalJangid" target="_blank">Author</a>
</p>

<br>

## :dart: About ##

Codeware 2.0 is the upgraded version of <a href="https://github.com/KhushalJangid/codeware" target="_blank">codeware</a>, with Multi-tab Editor, Terminal emulation and responsive UI with Light & Dark Mode.

## :sparkles: Features ##

:white_check_mark: Write & Edit code online\
:white_check_mark: Compile code on the go with IO Piping using Websockets\
:white_check_mark: Open & Edit local code files\
:white_check_mark: Multi Tab editing\
:white_check_mark: Responsive UI for Mobile and Desktop Screen sizes\
:white_check_mark: Light and Dark mode (more themes under progress)\
:white_check_mark: Download code files to your local machine\
:white_check_mark: Cloud Save for files on the server

## :rocket: Technologies ##

The following tools were used in this project:

- [Django](https://djangoproject.com/)
- [Python](https://python.org)
- [Flutter](https://flutter.dev/)


## :white_check_mark: Requirements ##

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Python](https://python.org/) installed.
It also requires compilers for supported languages [C/C++, JavaScript, Java, Python, Dart, Go] on the local machine to compile the code (if docker is not used).

## :checkered_flag: Starting ##

To run the Backend server

```bash
# Clone this project
$ git clone https://github.com/KhushalJangid/codeware-2.0

# Access
$ cd codeware-2.0/backend

# Activate any virtual environment (if any)

# Install dependencies
$ pip install -r requirements.txt

# Run the project
$ uvicorn codeware.asgi:application --loop uvloop

# The server will initialize in the <http://localhost:8000>
```

Alternatively, Run using docker (No need to have compilers on local machine):

```bash
# Clone this project
$ git clone https://github.com/KhushalJangid/codeware-2.0

# Access
$ cd codeware-2.0/backend

# Build Docker image
$ docker image build -t codeware-api .

# Run Docker container
$ docker run -p 8000:8000 codeware-api

# The server will initialize in the <http://localhost:8000>
```

For Frontend:

```bash
# Change directory
$ cd codeware-2.0/frontend

# Resolve dependencies
$ flutter pub get

# Run project
$ flutter run

```

## :memo: License ##

This project is under license from MIT. For more details, see the [LICENSE](LICENSE) file.


Made with :heart: by <a href="https://github.com/KhushalJangid" target="_blank">Khushal Jangid</a> 

&#xa0;

<a href="#top">Back to top</a>
