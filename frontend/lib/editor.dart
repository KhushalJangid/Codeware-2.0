import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:codeware/TabBar/bloc/bloc.dart';
import 'package:codeware/TabBar/bloc/states.dart';
import 'package:codeware/models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_code_editor/flutter_code_editor.dart';
// import 'package:flutter_highlight/themes/monokai-sublime.dart';
import 'package:flutter_highlight/themes/github.dart';
import 'package:flutter_highlight/themes/atom-one-dark.dart';
// import 'package:highlight/languages/python.dart';

class Editor extends StatefulWidget {
  const Editor({super.key});

  @override
  State<Editor> createState() => _EditorState();
}

class _EditorState extends State<Editor> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<TabBarBloc, TabBarState>(builder: (context, state) {
      if (state is Idle) {
        return Container();
      } else {
        final controller = CodeController(
          text: state.tabs[state.activeIndex].content,
          language: state.tabs[state.activeIndex].fileType.editorMode,
          params: const EditorParams(tabSpaces: 4),
        );
        controller.addListener(() {
          print(
              "editor.dart:38 ${controller.code.text == state.tabs[state.activeIndex].initialContent}");
          if (controller.code.text ==
              state.tabs[state.activeIndex].initialContent) {
            state.tabs[state.activeIndex].setDirty = false;
          } else {
            state.tabs[state.activeIndex].content = controller.code.text;
            state.tabs[state.activeIndex].setDirty = true;
          }
        });
        return ValueListenableBuilder(
          valueListenable: AdaptiveTheme.of(context).modeChangeNotifier,
          builder: (context, value, child) {
            if (value == AdaptiveThemeMode.dark) {
              return CodeTheme(
                data: CodeThemeData(
                  styles: atomOneDarkTheme,
                ),
                child: SingleChildScrollView(
                  child: CodeField(
                    controller: controller,
                    minLines: 3,
                    textStyle: const TextStyle(
                      fontSize: 18,
                      fontFamily: "Ubuntu Mono",
                    ),
                  ),
                ),
              );
            } else {
              return CodeTheme(
                data: CodeThemeData(styles: githubTheme),
                child: SingleChildScrollView(
                  child: CodeField(
                    controller: controller,
                    minLines: 3,
                    textStyle: const TextStyle(
                      fontSize: 18,
                      fontFamily: "Ubuntu Mono",
                    ),
                  ),
                ),
              );
            }
          },
        );
      }
    });
  }
}
