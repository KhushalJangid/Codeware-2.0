import 'package:codeware/models.dart';

abstract class TabBarState {
  List<FileTab> tabs = [];
  int activeIndex = -1;
  // TabBarState({required this.tabs, required this.activeIndex});
}

class Idle extends TabBarState {
  Idle() {
    activeIndex = -1;
    tabs = [];
  }
}

class Active extends TabBarState {
  // final List<FileTab> tabs;
  // final int activeIndex;
  Active({required List<FileTab> tabs, required int activeIndex}) {
    super.activeIndex = activeIndex;
    super.tabs = tabs;
  }
}

class Running extends TabBarState {
  // final List<FileTab> tabs;
  // final int RunningIndex;
  Running({required List<FileTab> tabs, required int activeIndex}) {
    super.activeIndex = activeIndex;
    super.tabs = tabs;
  }
}
