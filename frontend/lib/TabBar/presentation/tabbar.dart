import 'package:codeware/Console/bloc/bloc.dart';
import 'package:codeware/Console/bloc/events.dart' as console;
import 'package:codeware/TabBar/bloc/bloc.dart';
import 'package:codeware/TabBar/bloc/events.dart';
import 'package:codeware/TabBar/bloc/states.dart';
import 'package:codeware/TabBar/presentation/buttons.dart';
import 'package:codeware/models.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:simple_icons/simple_icons.dart';

class TabBar extends StatefulWidget {
  final double maxWidth;
  const TabBar({super.key, required this.maxWidth});

  @override
  State<TabBar> createState() => _TabBarState();
}

class _TabBarState extends State<TabBar> {
  @override
  Widget build(BuildContext context) {
    // final bloc = BlocProvider.of<TabBarBloc>(context);
    return BlocConsumer<TabBarBloc, TabBarState>(listener: (context, state) {
      if (state is Running) {
        BlocProvider.of<ConsoleBloc>(context).add(
          console.Open(state.tabs[state.activeIndex]),
        );
      }
    }, builder: (context, state) {
      if (state is Idle) {
        // Built when no tab is opened
        return Container(
          width: widget.maxWidth,
          color: Theme.of(context).colorScheme.secondary,
          height: 40,
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              CreateFileButton(),
              UploadFileButton(),
            ],
          ),
        );
      }
      if (state is Running) {
        //  Built when a tab is in running state
        return Container(
          width: widget.maxWidth,
          color: Theme.of(context).colorScheme.secondary,
          height: 40,
          child: Row(
            children: [
              Expanded(
                child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: state.tabs.length,
                    itemBuilder: (context, indx) {
                      return MouseRegion(
                        cursor: SystemMouseCursors.click,
                        child: GestureDetector(
                          onTap: () {
                            BlocProvider.of<TabBarBloc>(context).add(
                              SwitchTab(tabs: state.tabs, index: indx),
                            );
                          },
                          child: Tab(
                            tabs: state.tabs,
                            index: indx,
                          ),
                        ),
                      );
                    }),
              ),
              IconButton(
                onPressed: () {},
                color: Colors.red,
                icon: const Icon(
                  Icons.stop_rounded,
                ),
              ),
              DownloadButton(file: state.tabs[state.activeIndex]),
              CreateFileButton.inactive(),
              SyncFileButton.inactive(),
              UploadFileButton.inactive(),
            ],
          ),
        );
      }
      if (state is Active) {
        return Container(
          width: widget.maxWidth,
          color: Theme.of(context).colorScheme.secondary,
          height: 40,
          child: Row(
            children: [
              Expanded(
                child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: state.tabs.length,
                    itemBuilder: (context, indx) {
                      return MouseRegion(
                        cursor: SystemMouseCursors.click,
                        child: GestureDetector(
                          onTap: () {
                            BlocProvider.of<TabBarBloc>(context).add(
                              SwitchTab(tabs: state.tabs, index: indx),
                            );
                          },
                          child: Tab(
                            tabs: state.tabs,
                            index: indx,
                          ),
                        ),
                      );
                    }),
              ),
              IconButton(
                onPressed: () {
                  BlocProvider.of<TabBarBloc>(context).add(
                    Run(
                      tabs: state.tabs,
                      activeIndex: state.activeIndex,
                    ),
                  );
                },
                color: Colors.green,
                icon: const Icon(Icons.play_arrow_rounded),
              ),
              DownloadButton(file: state.tabs[state.activeIndex]),
              const CreateFileButton(),
              const SyncFileButton(),
              const UploadFileButton(),
            ],
          ),
        );
      }
      return Container(
        width: widget.maxWidth,
        color: Theme.of(context).colorScheme.secondary,
        height: 40,
        child: Row(
          children: [
            Expanded(
              child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: 2,
                  itemBuilder: (context, indx) {
                    return Container(
                      constraints: const BoxConstraints(minWidth: 120),
                      decoration: BoxDecoration(
                        color: Theme.of(context).colorScheme.onSecondary,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      margin: const EdgeInsets.symmetric(
                          vertical: 3, horizontal: 3),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 10),
                            child: Icon(
                              SimpleIcons.python,
                              size: 16,
                            ),
                          ),
                          Text(
                            "tab.name",
                            style: Theme.of(context).textTheme.labelSmall,
                          ),
                          // const Spacer(),
                          IconButton(
                            padding: EdgeInsets.zero,
                            iconSize: 16,
                            icon: const Icon(Icons.clear),
                            onPressed: () {},
                          ),
                        ],
                      ),
                    );
                  }),
            ),
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.play_arrow_outlined),
              tooltip: "Run Code",
            ),
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.save_as_outlined),
              tooltip: "Save current file",
            ),
            IconButton(
              onPressed: () {},
              icon: const Icon(Icons.upload_file_outlined),
              tooltip: "Upload a code file",
            ),
          ],
        ),
      );
    });
  }
}

class Tab extends StatelessWidget {
  final List<FileTab> tabs;
  final int index;
  const Tab({
    super.key,
    required this.tabs,
    required this.index,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minWidth: 120),
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.onSecondary,
        borderRadius: BorderRadius.circular(8),
      ),
      margin: const EdgeInsets.symmetric(vertical: 3, horizontal: 3),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: Icon(
              tabs[index].fileType.fileIcon,
              size: 16,
            ),
          ),
          ValueListenableBuilder(
              valueListenable: tabs[index].dirty,
              builder: (context, value, child) {
                if (value) {
                  return const Center(
                      child: Padding(
                    padding: EdgeInsets.only(right: 3),
                    child: Icon(
                      Icons.circle,
                      size: 10,
                    ),
                  ));
                } else {
                  return Container();
                }
              }),
          Text(
            tabs[index].name,
            style: Theme.of(context).textTheme.labelSmall,
          ),
          // const Spacer(),
          IconButton(
            padding: EdgeInsets.zero,
            iconSize: 16,
            icon: const Icon(Icons.clear),
            onPressed: () {
              BlocProvider.of<TabBarBloc>(context).add(
                Close(tabs: tabs, index: index),
              );
            },
          ),
        ],
      ),
    );
  }
}
