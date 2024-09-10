import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
// import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:codeware/Auth/exceptions/form_exceptions.dart';
import 'package:codeware/Auth/model/user_model.dart';
import 'package:codeware/Auth/services/auth_service.dart';

part 'register_event.dart';
part 'register_state.dart';

class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  RegisterBloc() : super(RegisterFormState()) {
    on<RegisterRequestEvent>((event, emit) async {
      emit(RegisterLoadingState());
      try {
        final user = await AuthService.register(
          email: event.email,
          password: event.password,
          firstName: event.firstName,
          lastName: event.lastName,
        );
        emit(RegisterSuccessState(
          user,
        ));
      } on FormGeneralException catch (e) {
        emit(RegisterErrorState(e));
      } on FormFieldsException catch (e) {
        emit(RegisterErrorState(e));
      } catch (e) {
        emit(RegisterErrorState(
          FormGeneralException(message: 'Unidentified error'),
        ));
      }
    });
  }
}
