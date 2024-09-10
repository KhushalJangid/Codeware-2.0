import 'package:flutter/material.dart';
import 'package:simple_icons/simple_icons.dart';
import 'package:highlight/languages/python.dart';
import 'package:highlight/languages/cpp.dart';
import 'package:highlight/languages/dart.dart';
import 'package:highlight/languages/go.dart';
import 'package:highlight/languages/java.dart';
import 'package:highlight/languages/javascript.dart';

class Dim {
  final double terminalHeight;
  final double maxHeight;
  final double width;
  const Dim(
      {required this.terminalHeight,
      required this.maxHeight,
      required this.width});
}

enum FileType {
  python,
  java,
  javascript,
  go,
  dart,
  c,
  cpp,
}

extension EditorMode on FileType {
  get editorMode {
    switch (this) {
      case FileType.python:
        return python;
      case FileType.java:
        return java;
      case FileType.javascript:
        return javascript;
      case FileType.c:
        return cpp;
      case FileType.cpp:
        return cpp;
      case FileType.go:
        return go;
      case FileType.dart:
        return dart;
      default:
        return cpp;
    }
  }
}

extension FileExtension on FileType {
  String get fileExtension {
    switch (this) {
      case FileType.python:
        return "py";
      case FileType.java:
        return "java";
      case FileType.javascript:
        return "js";
      case FileType.c:
        return "c";
      case FileType.cpp:
        return "cpp";
      case FileType.go:
        return "go";
      case FileType.dart:
        return "dart";
      default:
        return "txt";
    }
  }

  IconData get fileIcon {
    switch (this) {
      case FileType.python:
        return SimpleIcons.python;
      case FileType.java:
        return SimpleIcons.openjdk;
      case FileType.javascript:
        return SimpleIcons.javascript;
      case FileType.c:
        return SimpleIcons.codio;
      case FileType.cpp:
        return SimpleIcons.cplusplus;
      case FileType.go:
        return SimpleIcons.go;
      case FileType.dart:
        return SimpleIcons.dart;
      default:
        return SimpleIcons.python;
    }
  }

  String boilerplate(String fileName) {
    switch (this) {
      case FileType.python:
        return """print("hello world")""";
      case FileType.java:
        return """class $fileName{
    public static void main(String []args){
        System.out.println("Hello World!");
    }
}""";
      case FileType.javascript:
        return """console.log("hello wold");""";
      case FileType.c:
        return """#include <stdio.h>

int main() {
    printf("Hello World!");
    return 0;
}""";
      case FileType.cpp:
        return """#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!";
    return 0;
}""";
      case FileType.go:
        return """package main
import "fmt"

func main(){
    fmt.Println("Hello World")
}
""";
      case FileType.dart:
        return """void main(){
    print("Hello World");
}""";
      default:
        return """print("hello world")""";
    }
  }
}

FileType getFiletype(String extension) {
  switch (extension) {
    case "py":
      return FileType.python;
    case "java":
      return FileType.java;
    case "js":
      return FileType.javascript;
    case "dart":
      return FileType.dart;
    case "go":
      return FileType.go;
    case "c":
      return FileType.c;
    case "cpp":
      return FileType.cpp;
    default:
      return FileType.python;
  }
}

class CodeFile {
  final int id;
  final String name;
  final FileType fileType;
  const CodeFile({
    required this.id,
    required this.name,
    required this.fileType,
  });
  static CodeFile fromJson(Map json) {
    return CodeFile(
      id: json['id'],
      name: json['name'],
      fileType: getFiletype(json['name'].toString().split('.').last),
    );
  }
}

class FileTab {
  final int id;
  final String name;
  final FileType fileType;
  String content;
  String initialContent;
  // bool dirty;
  final _dirtyNotifier = ValueNotifier(false);
  FileTab({
    required this.id,
    required this.name,
    required this.content,
    required this.fileType,
  }) : initialContent = content;
  ValueNotifier<bool> get dirty => _dirtyNotifier;
  set setDirty(bool isDirty) {
    _dirtyNotifier.value = isDirty;
  }

  static FileTab fromJson(Map json) {
    return FileTab(
      id: json['id'],
      name: json['name'],
      content: json['contents'],
      fileType: getFiletype(json['name'].toString().split('.').last),
    );
  }
}
