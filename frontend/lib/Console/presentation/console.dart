import 'package:codeware/Console/bloc/bloc.dart';
import 'package:codeware/Console/bloc/states.dart';
import 'package:codeware/Console/presentation/terminal.dart';
import 'package:codeware/models.dart';
// import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
// import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class Console extends StatefulWidget {
  // final double maxWidth;
  final ValueNotifier<Dim> notifier;
  const Console({super.key, required this.notifier});

  @override
  State<Console> createState() => _ConsoleState();
}

class _ConsoleState extends State<Console> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<ConsoleBloc, ConsoleState>(
      // bloc: ConsoleBloc(),
      // buildWhen: (previous, current) {
      //   if (previous is Active && current is Active) {
      //     return true;
      //   } else if (current is Active) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // },
      builder: (context, state) {
        if (state is Active) {
          return Terminal(
            channel: state.channel,
            notifier: widget.notifier,
          );
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
                  // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Console',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                    const Spacer(),
                    IconButton(
                      onPressed: () {
                        final val = widget.notifier.value;
                        widget.notifier.value = Dim(
                          terminalHeight: val.maxHeight,
                          maxHeight: val.maxHeight,
                          width: val.width,
                        );
                      },
                      padding: EdgeInsets.zero,
                      tooltip: "Toggle Fullscreen",
                      icon: const Icon(
                        Icons.fullscreen,
                      ),
                    ),
                    IconButton(
                      onPressed: () {
                        final val = widget.notifier.value;
                        widget.notifier.value = Dim(
                          terminalHeight: 30,
                          maxHeight: val.maxHeight,
                          width: val.width,
                        );
                      },
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
              ),
            ),
            Container(
              width: widget.notifier.value.width,
              height: 35,
              color: Theme.of(context).colorScheme.secondary,
              child: const Row(
                children: [
                  Padding(
                    padding: EdgeInsets.only(left: 10, right: 2),
                    child: Icon(
                      Icons.arrow_forward_ios,
                      size: 16,
                    ),
                  ),
                  Expanded(
                    child: TextField(
                      style: TextStyle(
                        fontSize: 18,
                        fontFamily: "Ubuntu Mono",
                      ),
                      cursorHeight: 16,
                      textAlignVertical: TextAlignVertical.center,
                      decoration: InputDecoration(
                        // prefix: const Text(">>"),
                        isDense: true,
                        contentPadding: EdgeInsets.symmetric(
                          vertical: 5,
                          horizontal: 3,
                        ),

                        hintText: "Input",
                        hintStyle: TextStyle(
                          fontSize: 18,
                          fontFamily: "Ubuntu Mono",
                        ),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ],
              ),
            )
          ],
        );
      },
    );
  }
}
