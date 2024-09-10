import 'package:codeware/Console/api/api.dart';
import 'package:codeware/Console/bloc/events.dart';
import 'package:codeware/Console/bloc/states.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ConsoleBloc extends Bloc<ConsoleEvent, ConsoleState> {
  ConsoleBloc() : super(Idle()) {
    on<Open>((event, emit) {
      final channel = connect(event.file);
      // listener(channel);
      emit(Active(channel));
    });
    on<Close>((event, emit) => emit(Idle()));
  }
}
