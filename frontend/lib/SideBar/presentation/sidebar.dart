// import 'package:codeware/Auth/blocs/auth/auth_bloc.dart';
import 'dart:convert';

import 'package:carbon_icons/carbon_icons.dart';
import 'package:codeware/Auth/screens/login/bloc/login_bloc.dart';
import 'package:codeware/Auth/screens/login/login.dart';
import 'package:codeware/SideBar/api/api.dart';
import 'package:codeware/SideBar/bloc/bloc.dart';
import 'package:codeware/SideBar/bloc/events.dart';
// import 'package:codeware/SideBar/bloc/events.dart';
import 'package:codeware/SideBar/bloc/states.dart';
import 'package:codeware/TabBar/bloc/bloc.dart';
import 'package:codeware/TabBar/bloc/events.dart' as tbe;
import 'package:codeware/models.dart';
import 'package:codeware/widgets.dart';
import 'package:file_saver/file_saver.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SideBar extends StatefulWidget {
  const SideBar({super.key});

  @override
  State<SideBar> createState() => _SideBarState();
}

class _SideBarState extends State<SideBar> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<SideBarBloc, SideBarState>(
      listener: (context, state) {
        if (state is OpenFile) {
          final bloc = BlocProvider.of<TabBarBloc>(context);
          bloc.add(
            tbe.Open(
              tabs: bloc.state.tabs,
              activeIndex: bloc.state.activeIndex,
              file: state.files[state.index],
            ),
          );
        }
      },
      builder: (context, state) {
        if (state is Loading) {
          return Drawer(
            child: Scaffold(
              appBar: AppBar(
                title: Text(
                  "Files",
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
              body: const Center(
                child: CircularProgressIndicator(),
              ),
            ),
          );
        }
        if (state is OpenFile) {
          return Drawer(
            child: Scaffold(
              appBar: AppBar(
                title: Text(
                  "Files",
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                actions: [
                  IconButton(
                    onPressed: () {},
                    icon: const Icon(CarbonIcons.document_add),
                  ),
                ],
              ),
              body: ListView.builder(
                itemCount: state.files.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    autofocus: index == state.index,
                    leading: Icon(state.files[index].fileType.fileIcon),
                    title: Text(state.files[index].name),
                    trailing: FloatingMenu(
                      state: Idle(state.files),
                      index: index,
                      file: state.files[index],
                    ),
                    onTap: () {
                      BlocProvider.of<SideBarBloc>(context).add(
                        Open(files: state.files, index: index),
                      );
                      Navigator.pop(context);
                    },
                  );
                },
              ),
            ),
          );
        }
        if (state is Idle) {
          return Drawer(
            child: Scaffold(
              appBar: AppBar(
                title: Text(
                  "Files",
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                actions: [
                  IconButton(
                    onPressed: () async {
                      final bloc = BlocProvider.of<SideBarBloc>(context);
                      final String? result = await showDialog(
                        context: context,
                        builder: (ctx) {
                          return const CreateFileDialog();
                        },
                      );
                      if (result != null) {
                        bloc.add(Create(
                          files: state.files,
                          fileName: result,
                          fileType: getFiletype(result.split('.').last),
                        ));
                      }
                    },
                    icon: const Icon(CarbonIcons.document_add),
                  ),
                ],
              ),
              body: ListView.builder(
                itemCount: state.files.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    leading: Icon(state.files[index].fileType.fileIcon),
                    title: Text(state.files[index].name),
                    trailing: FloatingMenu(
                      state: state,
                      index: index,
                      file: state.files[index],
                    ),
                    onTap: () {
                      BlocProvider.of<SideBarBloc>(context).add(
                        Open(files: state.files, index: index),
                      );
                      Navigator.pop(context);
                    },
                  );
                },
              ),
            ),
          );
        } else if (state is Unauthenticated) {
          return Drawer(
            child: Scaffold(
              appBar: AppBar(
                title: Text(
                  "Files",
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
              body: SizedBox(
                width: double.maxFinite,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Login to view your files",
                      textAlign: TextAlign.center,
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => BlocProvider(
                              create: (BuildContext context) => LoginBloc(),
                              child: LoginScreen(
                                bloc: BlocProvider.of<SideBarBloc>(context),
                              ),
                            ),
                          ),
                        );
                      },
                      child: const Text("Login"),
                    ),
                  ],
                ),
              ),
            ),
          );
        }
        return Drawer(
          child: Scaffold(
            appBar: AppBar(
              title: const Text("Files"),
            ),
            body: ListView.builder(
              itemCount: 10,
              itemBuilder: (context, index) {
                return const ListTile(
                  leading: Icon(Icons.file_open),
                  title: Text("Test.py"),
                );
              },
            ),
          ),
        );
      },
    );
  }
}

class FloatingMenu extends StatelessWidget {
  final Idle state;
  final int index;
  final CodeFile file;
  const FloatingMenu({
    super.key,
    required this.state,
    required this.index,
    required this.file,
  });

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<int>(
      icon: const Icon(Icons.more_vert),
      itemBuilder: (context) => [
        const PopupMenuItem(
          value: 1,
          child: Row(
            children: [
              Icon(Icons.drive_file_rename_outline_rounded),
              SizedBox(
                width: 10,
              ),
              Text("Rename")
            ],
          ),
        ),
        const PopupMenuItem(
          value: 2,
          child: Row(
            children: [
              Icon(Icons.download_for_offline_outlined),
              SizedBox(
                width: 10,
              ),
              Text("Download")
            ],
          ),
        ),
        // PopupMenuItem 2
        const PopupMenuItem(
          value: 3,
          // row with two children
          child: Row(
            children: [
              Icon(Icons.delete_outline),
              SizedBox(
                width: 10,
              ),
              Text("Delete")
            ],
          ),
        ),
      ],
      // offset: Offset(0, 100),
      // color: Colors.grey,
      elevation: 2,
      // on selected we show the dialog box
      onSelected: (value) async {
        final bloc = BlocProvider.of<SideBarBloc>(context);
        if (value == 1) {
          final String? res = await showDialog(
            context: context,
            builder: (ctx) {
              return RenameFileDialog(
                file: file,
              );
            },
          );
          if (res != null) {
            CodeFile newfile = CodeFile(
              id: file.id,
              name: res,
              fileType: file.fileType,
            );
            bloc.add(Rename(
              files: state.files,
              index: index,
              newfile: newfile,
            ));
          }
        } else if (value == 2) {
          final f = await FileApi().readBytes(file.id);
          await FileSaver.instance.saveFile(
            name: file.name,
            bytes: utf8.encode(f.content),
          );
        } else {
          final bool res = await showDialog(
            context: context,
            builder: (ctx) {
              return const ConfirmDelete();
            },
          );
          if (res) {
            bloc.add(Delete(files: state.files, index: index));
          }
        }
      },
    );
  }
}
