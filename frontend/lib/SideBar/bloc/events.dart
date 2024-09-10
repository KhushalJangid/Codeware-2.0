import 'package:codeware/models.dart';

abstract class SideBarEvent {}

class CheckLogin extends SideBarEvent {}

class Open extends SideBarEvent {
  final List<CodeFile> files;
  final int index;
  Open({required this.files, required this.index});
}

class Rename extends SideBarEvent {
  final List<CodeFile> files;
  final int index;
  final CodeFile newfile;
  Rename({
    required this.files,
    required this.index,
    required this.newfile,
  });
}

class Delete extends SideBarEvent {
  final List<CodeFile> files;
  final int index;
  Delete({required this.files, required this.index});
}

class Create extends SideBarEvent {
  final List<CodeFile> files;
  final String fileName;
  final FileType fileType;
  Create({
    required this.files,
    required this.fileName,
    required this.fileType,
  });
}

class Load extends SideBarEvent {}
