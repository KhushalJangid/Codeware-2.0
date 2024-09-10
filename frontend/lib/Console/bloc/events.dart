import 'package:codeware/models.dart';

abstract class ConsoleEvent {}

class Open extends ConsoleEvent {
  final FileTab file;
  Open(this.file);
}

class Close extends ConsoleEvent {}

class Input extends ConsoleEvent {}

class Output extends ConsoleEvent {}
