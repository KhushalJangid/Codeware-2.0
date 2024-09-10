import 'package:codeware/models.dart';

abstract class TabBarEvent {}

class SwitchTab extends TabBarEvent {
  final List<FileTab> tabs;
  final int index;
  SwitchTab({required this.tabs, required this.index});
}

class Open extends TabBarEvent {
  final List<FileTab> tabs;
  final int activeIndex;
  final CodeFile file;
  Open({
    required this.tabs,
    required this.activeIndex,
    required this.file,
  });
}

class Create extends TabBarEvent {
  final List<FileTab> tabs;
  final int index;
  final String fileName;
  final FileType fileType;
  Create({
    required this.tabs,
    required this.index,
    required this.fileName,
    required this.fileType,
  });
}

class Close extends TabBarEvent {
  final List<FileTab> tabs;
  final int index;
  Close({required this.tabs, required this.index});
}

class Run extends TabBarEvent {
  final List<FileTab> tabs;
  final int activeIndex;
  Run({required this.tabs, required this.activeIndex});
}

class Save extends TabBarEvent {
  final List<FileTab> tabs;
  final int activeIndex;
  Save({required this.tabs, required this.activeIndex});
}

class Upload extends TabBarEvent {
  final List<FileTab> tabs;
  final int activeIndex;
  Upload({required this.tabs, required this.activeIndex});
}
