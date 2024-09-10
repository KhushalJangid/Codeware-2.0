import 'dart:convert';
import 'package:codeware/Auth/services/auth_service.dart';
import 'package:codeware/TabBar/api/api.dart';
import 'package:codeware/TabBar/bloc/events.dart';
import 'package:codeware/TabBar/bloc/states.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:codeware/models.dart' as m;

class TabBarBloc extends Bloc<TabBarEvent, TabBarState> {
  TabBarBloc() : super(Idle()) {
    on<SwitchTab>(
      (event, emit) {
        emit(Active(tabs: event.tabs, activeIndex: event.index));
      },
    );
    on<Create>(
      (event, emit) async {
        final content = event.fileType.boilerplate(
          event.fileName.split('.').first,
        );
        if (await AuthService.checkLogin()) {
          final res = await TabApi().upload(
            utf8.encode(content),
            event.fileName,
          );
          final data = m.FileTab(
            id: res,
            name: event.fileName,
            content: content,
            fileType: event.fileType,
          );
          event.tabs.add(data);
          emit(Active(tabs: event.tabs, activeIndex: event.tabs.length - 1));
        } else {
          final data = m.FileTab(
            id: -1,
            name: event.fileName,
            content: content,
            fileType: event.fileType,
          );
          event.tabs.add(data);
          emit(Active(tabs: event.tabs, activeIndex: event.tabs.length - 1));
        }
      },
    );
    on<Open>((event, emit) async {
      final res = event.tabs.where((e) => e.id == event.file.id);
      if (res.isEmpty) {
        final data = await TabApi().open(event.file.id);
        event.tabs.add(data);
        emit(Active(tabs: event.tabs, activeIndex: event.tabs.length - 1));
      } else {
        emit(
          Active(
            tabs: event.tabs,
            activeIndex: event.tabs.indexWhere((e) => e.id == event.file.id),
          ),
        );
      }
    });
    on<Run>((event, emit) {
      emit(Running(tabs: event.tabs, activeIndex: event.activeIndex));
    });
    on<Save>((event, emit) async {
      final file = event.tabs[event.activeIndex];
      final res = await TabApi().save(
        utf8.encode(file.content),
        file.name,
        file.id,
      );
      if (res) {
        file.dirty.value = false;
      }
      emit(Active(tabs: event.tabs, activeIndex: event.activeIndex));
    });
    on<Upload>((event, emit) async {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions:
            m.FileType.values.map((e) => e.fileExtension).toList(),
      );
      if (result != null) {
        final file = result.files.first;
        if (file.bytes != null) {
          if (await AuthService.checkLogin()) {
            final res = await TabApi().upload(
              file.bytes!,
              file.name,
            );
            final data = m.FileTab(
              id: res,
              name: file.name,
              content: await file.xFile.readAsString(),
              fileType: m.getFiletype(
                file.name.split('.').last,
              ),
            );
            event.tabs.add(data);
            emit(Active(tabs: event.tabs, activeIndex: event.tabs.length - 1));
            return;
          }
          // if (res) {
          final data = m.FileTab(
            id: -1,
            name: file.name,
            content: await file.xFile.readAsString(),
            fileType: m.getFiletype(
              file.name.split('.').last,
            ),
          );
          event.tabs.add(data);
          emit(Active(tabs: event.tabs, activeIndex: event.tabs.length - 1));
          // }
        }
      } else {
        // User canceled the picker
      }
    });
    on<Close>((event, emit) {
      event.tabs.removeAt(event.index);
      int activeIndex;
      if (event.tabs.isEmpty) {
        // activeIndex = -1;
        emit(Idle());
        return;
      } else {
        if (event.index == 0) {
          activeIndex = 0;
        } else {
          activeIndex = event.index - 1;
        }
      }
      emit(Active(tabs: event.tabs, activeIndex: activeIndex));
    });
  }
}
