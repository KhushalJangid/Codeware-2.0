import 'package:codeware/models.dart';
import 'package:flutter/material.dart';

class CreateFileDialog extends StatefulWidget {
  const CreateFileDialog({super.key});

  @override
  State<CreateFileDialog> createState() => _CreateFileDialogState();
}

class _CreateFileDialogState extends State<CreateFileDialog> {
  FileType fileType = FileType.python;
  IconData icon = FileType.python.fileIcon;
  final name = TextEditingController();
  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      // icon: const Icon(CarbonIcons.document_add),
      title: const Text("New File"),
      content: Padding(
        padding: const EdgeInsets.symmetric(vertical: 15),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.only(right: 10),
              child: Icon(
                icon,
                size: 18,
              ),
            ),
            Expanded(
              child: TextField(
                controller: name,
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: "File name",
                  contentPadding: EdgeInsets.only(bottom: 6),
                  isDense: true,
                ),
                onSubmitted: (val) {
                  if (val != "") {
                    Navigator.pop(
                        context, "${name.text}.${fileType.fileExtension}");
                  } else {
                    Navigator.pop(context);
                  }
                },
              ),
            ),
            DropdownButton<FileType>(
              padding: const EdgeInsets.only(bottom: 0),
              elevation: 0,
              isDense: true,
              value: fileType,
              underline: null,
              items: FileType.values
                  .map(
                    (e) => DropdownMenuItem(
                      value: e,
                      child: Text(".${e.fileExtension}"),
                    ),
                  )
                  .toList(),
              onChanged: (val) {
                if (val != null) {
                  setState(() {
                    fileType = val;
                    icon = val.fileIcon;
                  });
                }
              },
            ),
          ],
        ),
      ),
      actionsAlignment: MainAxisAlignment.spaceEvenly,
      actions: [
        OutlinedButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text("Cancel"),
        ),
        ElevatedButton(
          onPressed: () {
            Navigator.pop(context, "${name.text}.${fileType.fileExtension}");
          },
          child: const Text("Create"),
        ),
      ],
    );
  }
}

class RenameFileDialog extends StatelessWidget {
  RenameFileDialog({super.key, required this.file});
  final CodeFile file;
  final nameController = TextEditingController();
  @override
  Widget build(BuildContext context) {
    nameController.text = file.name.split('.').first;
    return AlertDialog(
      // icon: const Icon(CarbonIcons.document_add),
      title: const Text("Rename File"),
      content: Padding(
        padding: const EdgeInsets.symmetric(vertical: 15),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.only(right: 10),
              child: Icon(
                file.fileType.fileIcon,
                size: 18,
              ),
            ),
            Expanded(
              child: TextField(
                controller: nameController,
                autofocus: true,
                decoration: const InputDecoration(
                  hintText: "File name",
                  contentPadding: EdgeInsets.only(bottom: 6),
                  isDense: true,
                ),
                onSubmitted: (val) {
                  if (val != "") {
                    Navigator.pop(context,
                        "${nameController.text}.${file.fileType.fileExtension}");
                  } else {
                    Navigator.pop(context);
                  }
                },
              ),
            ),
            Text(".${file.fileType.fileExtension}"),
          ],
        ),
      ),
      actionsAlignment: MainAxisAlignment.spaceEvenly,
      actions: [
        OutlinedButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: const Text("Cancel"),
        ),
        ElevatedButton(
          onPressed: () {
            Navigator.pop(context,
                "${nameController.text}.${file.fileType.fileExtension}");
          },
          child: const Text("Rename"),
        ),
      ],
    );
  }
}

class ConfirmDelete extends StatelessWidget {
  const ConfirmDelete({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Confirm Deletion"),
      content: const Padding(
        padding: EdgeInsets.symmetric(vertical: 15),
        child: Text("Are you sure you want to delete the file?"),
      ),
      actionsAlignment: MainAxisAlignment.spaceEvenly,
      actions: [
        OutlinedButton(
          onPressed: () {
            Navigator.pop(context, false);
          },
          child: const Text("Cancel"),
        ),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.red,
            foregroundColor: Colors.amber.shade100,
          ),
          onPressed: () {
            Navigator.pop(context, true);
          },
          child: const Text("Delete"),
        ),
      ],
    );
  }
}
