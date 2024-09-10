import 'dart:convert';

import 'package:carbon_icons/carbon_icons.dart';
import 'package:codeware/TabBar/bloc/bloc.dart';
import 'package:codeware/TabBar/bloc/events.dart';
import 'package:codeware/models.dart';
import 'package:codeware/widgets.dart';
import 'package:file_saver/file_saver.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class CreateFileButton extends StatelessWidget {
  const CreateFileButton({super.key});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      tooltip: "Create a new file",
      onPressed: () async {
        final bloc = BlocProvider.of<TabBarBloc>(context);
        final String? result = await showDialog(
          context: context,
          builder: (ctx) {
            return const CreateFileDialog();
          },
        );
        if (result != null) {
          bloc.add(
            Create(
              tabs: bloc.state.tabs,
              index: bloc.state.activeIndex,
              fileName: result,
              fileType: getFiletype(
                result.split('.').last,
              ),
            ),
          );
        }
      },
      icon: const Icon(
        CarbonIcons.document_add,
        size: 20,
      ),
    );
  }

  static Widget inactive() {
    return IconButton(
      tooltip: "Create a new file",
      onPressed: () {},
      icon: const Icon(
        CarbonIcons.document_add,
        size: 20,
      ),
    );
  }
}

class DownloadButton extends StatelessWidget {
  final FileTab file;
  const DownloadButton({super.key, required this.file});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      tooltip: "Download file",
      onPressed: () async {
        await FileSaver.instance.saveFile(
          name: file.name,
          bytes: utf8.encode(file.content),
        );
      },
      icon: const Icon(
        CarbonIcons.download,
        size: 20,
      ),
    );
  }

  static Widget inactive() {
    return IconButton(
      tooltip: "Download file",
      onPressed: () {},
      icon: const Icon(
        CarbonIcons.download,
        size: 20,
      ),
    );
  }
}

class UploadFileButton extends StatelessWidget {
  const UploadFileButton({super.key});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      tooltip: "Upload a local file",
      onPressed: () {
        final bloc = BlocProvider.of<TabBarBloc>(context);
        bloc.add(
          Upload(
            tabs: bloc.state.tabs,
            activeIndex: bloc.state.activeIndex,
          ),
        );
      },
      icon: const Icon(Icons.cloud_upload_outlined),
    );
  }

  static Widget inactive() {
    return IconButton(
      tooltip: "Upload a local file",
      onPressed: () {},
      icon: const Icon(Icons.cloud_upload_outlined),
    );
  }
}

class SyncFileButton extends StatelessWidget {
  const SyncFileButton({super.key});

  @override
  Widget build(BuildContext context) {
    return IconButton(
      tooltip: "Sync file with server",
      onPressed: () {
        final bloc = BlocProvider.of<TabBarBloc>(context);
        bloc.add(
          Save(
            tabs: bloc.state.tabs,
            activeIndex: bloc.state.activeIndex,
          ),
        );
      },
      icon: const Icon(
        Icons.cloud_sync,
        weight: 0.5,
      ),
    );
  }

  static Widget inactive() {
    return IconButton(
      tooltip: "Sync file with server",
      onPressed: () {},
      icon: const Icon(
        Icons.cloud_sync,
        weight: 0.5,
      ),
    );
  }
}
