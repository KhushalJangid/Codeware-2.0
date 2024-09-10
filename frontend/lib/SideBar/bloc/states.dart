import 'package:codeware/models.dart';

sealed class SideBarState {}

class Active extends SideBarState {}

class OpenFile extends SideBarState {
  final List<CodeFile> files;
  final int index;
  OpenFile(this.files, this.index);
}

class Unauthenticated extends SideBarState {}

class Idle extends SideBarState {
  final List<CodeFile> files;
  Idle(this.files);
}

class Loading extends SideBarState {}
