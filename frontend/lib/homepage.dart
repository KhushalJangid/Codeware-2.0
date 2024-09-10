import 'dart:html';

import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:codeware/Console/presentation/console.dart';
import 'package:codeware/SideBar/presentation/sidebar.dart';
// import 'package:codeware/TabBar/bloc/bloc.dart';
// import 'package:codeware/TabBar/bloc/states.dart';
import 'package:codeware/TabBar/presentation/tabbar.dart' as tab;
import 'package:codeware/editor.dart';
import 'package:codeware/models.dart';
import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  // double _terminalHeight = 200.0;
  ValueNotifier<Dim>? dimNotifier;
  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    dimNotifier = ValueNotifier<Dim>(
      Dim(
        terminalHeight: 200,
        maxHeight: 0,
        width: MediaQuery.of(context).size.width,
      ),
    );
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: false,
        elevation: 0,
        scrolledUnderElevation: 0,
        title: Text(
          "Codeware",
          style: Theme.of(context).textTheme.titleLarge,
        ),
        actions: [
          if (document.fullscreenElement != null)
            IconButton(
              onPressed: () {
                document.exitFullscreen();
                setState(() {});
              },
              icon: const Icon(Icons.fullscreen_exit),
            ),
          if (document.fullscreenElement == null)
            IconButton(
              onPressed: () {
                document.documentElement!.requestFullscreen();
                setState(() {});
              },
              icon: const Icon(Icons.fullscreen),
            ),
          ValueListenableBuilder(
              valueListenable: AdaptiveTheme.of(context).modeChangeNotifier,
              builder: (context, value, child) {
                if (value == AdaptiveThemeMode.dark) {
                  return IconButton(
                    onPressed: () {
                      AdaptiveTheme.of(context).setLight();
                      setState(() {});
                    },
                    icon: const Icon(Icons.light_mode),
                  );
                } else {
                  return IconButton(
                    onPressed: () {
                      AdaptiveTheme.of(context).setDark();
                      setState(() {});
                    },
                    icon: const Icon(Icons.dark_mode),
                  );
                }
              })
        ],
      ),
      drawer: const SideBar(),
      body: LayoutBuilder(builder: (context, constraints) {
        final val = dimNotifier!.value;
        dimNotifier!.value = Dim(
          terminalHeight: val.terminalHeight,
          maxHeight: constraints.maxHeight,
          width: constraints.maxWidth,
        );
        print("homepage.dart:101 $dimNotifier");
        return ValueListenableBuilder(
          valueListenable: dimNotifier!,
          builder: (context, value, child) {
            return Stack(
              children: [
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: value.terminalHeight,
                  child: Column(
                    children: [
                      tab.TabBar(
                        maxWidth: value.width,
                      ),
                      Expanded(
                        child: Container(
                          color: Theme.of(context).colorScheme.tertiary,
                          child: const Editor(),
                        ),
                      ),
                    ],
                  ),
                ),
                // Terminal panel
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: value.terminalHeight,
                  child: Console(
                    notifier: dimNotifier!,
                  ),
                ),
                // Resizable handle
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: value.terminalHeight - 5,
                  height: 5,
                  child: MouseRegion(
                    cursor: SystemMouseCursors.resizeUpDown,
                    child: GestureDetector(
                      onVerticalDragUpdate: (details) {
                        // setState(() {
                        //   _terminalHeight -= details.delta.dy;
                        //   if (_terminalHeight < 100.0) _terminalHeight = 100.0;
                        //   if (_terminalHeight > constraints.maxHeight - 100.0) {
                        //     _terminalHeight = constraints.maxHeight - 100.0;
                        //   }
                        // });
                        final terminalHeight =
                            value.terminalHeight - details.delta.dy;
                        dimNotifier!.value = Dim(
                          terminalHeight: terminalHeight,
                          maxHeight: constraints.maxHeight,
                          width: value.width,
                        );
                        print("homepage.dart:160 $dimNotifier");
                      },
                      child: Container(
                        height: 5,
                        // color: Colors.grey[400],
                        color: Colors.transparent,
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        );
      }),
      // bottomSheet: MyDraggableSheet(),
    );
  }
}
