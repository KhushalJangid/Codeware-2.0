// import 'package:codeware/Auth/model/user_model.dart';
import 'dart:convert';
import 'package:codeware/Auth/services/auth_service.dart';
import 'package:codeware/SideBar/api/api.dart';
import 'package:codeware/SideBar/bloc/events.dart';
import 'package:codeware/SideBar/bloc/states.dart';
import 'package:codeware/models.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class SideBarBloc extends Bloc<SideBarEvent, SideBarState> {
  SideBarBloc() : super(Loading()) {
    on<CheckLogin>((event, emit) async {
      print(await AuthService.checkLogin());
      if (await AuthService.checkLogin()) {
        add(Load());
      } else {
        emit(Unauthenticated());
      }
    });
    on<Open>((event, emit) {
      emit(OpenFile(event.files, event.index));
    });
    on<Rename>((event, emit) async {
      final res = await FileApi().rename(event.newfile.id, event.newfile.name);
      if (res) {
        event.files[event.index] = event.newfile;
        emit(Idle(event.files));
      }
    });
    on<Create>((event, emit) async {
      final content = event.fileType.boilerplate(
        event.fileName.split('.').first,
      );
      final res = await FileApi().upload(
        utf8.encode(content),
        event.fileName,
      );
      event.files.add(CodeFile(
        id: res,
        name: event.fileName,
        fileType: event.fileType,
      ));
      emit(Idle(event.files));
    });
    on<Load>((event, emit) async {
      final files = await FileApi().get();
      emit(Idle(files));
    });
    on<Delete>((event, emit) async {
      final id = event.files[event.index].id;
      final res = await FileApi().delete(id);
      if (res) {
        event.files.removeAt(event.index);
        emit(Idle(event.files));
      }
    });
    add(CheckLogin());
  }
  refresh() {
    add(CheckLogin());
  }
}
