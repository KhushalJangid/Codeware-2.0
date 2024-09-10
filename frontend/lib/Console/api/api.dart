import 'dart:convert';

import 'package:codeware/models.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

const wsUrl = "ws://127.0.0.1:8000/ws/iostream";

WebSocketChannel connect(FileTab file) {
  final WebSocketChannel channel = WebSocketChannel.connect(Uri.parse(wsUrl));
  channel.sink.add(jsonEncode({
    "lang": file.fileType.fileExtension,
    "code": file.content,
  }));
  return channel;
}
