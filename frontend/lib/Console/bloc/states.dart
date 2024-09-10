import 'package:web_socket_channel/web_socket_channel.dart';

abstract class ConsoleState {}

class Idle extends ConsoleState {
  Idle();
}

class Active extends ConsoleState {
  final WebSocketChannel channel;
  Active(this.channel);
}

class Minimized extends ConsoleState {}

class Maximized extends ConsoleState {}

class PromptInput extends ConsoleState {}

class WriteOutput extends ConsoleState {}
