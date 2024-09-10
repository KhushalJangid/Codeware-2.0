import 'dart:convert';
import 'package:codeware/TabBar/bloc/bloc.dart';
import 'package:codeware/TabBar/bloc/events.dart';
import 'package:codeware/TabBar/bloc/states.dart';
import 'package:codeware/models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class Terminal extends StatefulWidget {
  final WebSocketChannel channel;
  final ValueNotifier<Dim> notifier;
  const Terminal({
    super.key,
    required this.channel,
    required this.notifier,
  });

  @override
  State<Terminal> createState() => _TerminalState();
}

class _TerminalState extends State<Terminal> {
  final input = TextEditingController();
  final output = TextEditingController();
  final error = TextEditingController();
  final inputNode = FocusNode();
  late WebSocketChannel channel;
  // final scrollController = ScrollController();

  listener(WebSocketChannel channel) {
    output.clear();
    channel.stream.listen(
      (event) {
        final data = jsonDecode(event);
        // scrollController.animateTo(
        //   scrollController.position.maxScrollExtent,
        //   duration: const Duration(milliseconds: 500),
        //   curve: Curves.ease,
        // );
        if (data["status"] == 200) {
          setState(() {
            output.text = output.text + data["output"];
          });
        } else {
          setState(() {
            error.text = error.text + data["output"];
          });
        }
        inputNode.requestFocus();
      },
      onDone: () {
        final bloc = BlocProvider.of<TabBarBloc>(context);
        print("terminal.dart:39 ${bloc.state}");
        if (bloc.state is Running) {
          bloc.add(
            SwitchTab(
              tabs: bloc.state.tabs,
              index: bloc.state.activeIndex,
            ),
          );
          // BlocProvider.of<ConsoleBloc>(context).add();
        }
      },
    );
  }

  @override
  void initState() {
    channel = widget.channel;
    listener(channel);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    print("terminal.dart:72 ${channel == widget.channel}");
    if (channel != widget.channel) {
      channel = widget.channel;
      listener(channel);
    }
    return Column(
      children: [
        Container(
          width: widget.notifier.value.width,
          color: Theme.of(context).colorScheme.secondary,
          height: 30,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              children: [
                Text(
                  'Console',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const Spacer(),
                IconButton(
                  onPressed: () {
                    setState(() {
                      output.clear();
                    });
                  },
                  padding: EdgeInsets.zero,
                  tooltip: "Clear console",
                  icon: const Icon(
                    Icons.delete_outline,
                  ),
                ),
                IconButton(
                  onPressed: () {},
                  padding: EdgeInsets.zero,
                  tooltip: "Toggle Fullscreen",
                  icon: const Icon(
                    Icons.fullscreen,
                  ),
                ),
                IconButton(
                  onPressed: () {},
                  padding: EdgeInsets.zero,
                  tooltip: "Close Console",
                  icon: const Icon(
                    Icons.clear,
                  ),
                ),
              ],
            ),
          ),
        ),
        Expanded(
          child: Container(
            color: Theme.of(context).colorScheme.onSecondary,
            width: widget.notifier.value.width,
            child: Padding(
              padding: const EdgeInsets.only(top: 15, left: 15),
              child: SingleChildScrollView(
                // controller: ScrollController(),
                child: RichText(
                  text: TextSpan(
                      text: output.text,
                      style: TextStyle(
                        fontSize: 18,
                        color: Theme.of(context).colorScheme.primary,
                        fontFamily: "Ubuntu Mono",
                      ),
                      children: [
                        TextSpan(
                          text: error.text,
                          style: const TextStyle(
                            fontSize: 18,
                            color: Colors.red,
                            fontFamily: "Ubuntu Mono",
                          ),
                        )
                      ]),
                ),
              ),
            ),
          ),
        ),
        Container(
          width: widget.notifier.value.width,
          height: 35,
          color: Theme.of(context).colorScheme.secondary,
          child: Row(
            children: [
              const Padding(
                padding: EdgeInsets.only(left: 10, right: 2),
                child: Icon(
                  Icons.arrow_forward_ios,
                  size: 16,
                ),
              ),
              Expanded(
                child: TextField(
                  controller: input,
                  style: const TextStyle(
                    fontSize: 18,
                    fontFamily: "Ubuntu Mono",
                  ),
                  cursorHeight: 16,
                  textAlignVertical: TextAlignVertical.center,
                  focusNode: inputNode,
                  decoration: const InputDecoration(
                    hintText: "Input",
                    contentPadding: EdgeInsets.symmetric(
                      vertical: 5,
                      horizontal: 3,
                    ),
                    isDense: true,
                    border: InputBorder.none,
                  ),
                  onSubmitted: (text) {
                    widget.channel.sink.add(jsonEncode({
                      "input": "$text\n",
                    }));
                    setState(() {
                      output.text = "${output.text}$text\n";
                    });
                    input.clear();
                  },
                ),
              ),
            ],
          ),
        )
      ],
    );
  }
}
