import 'package:codeware/Auth/screens/login/bloc/login_bloc.dart';
import 'package:codeware/Auth/screens/register/bloc/register_bloc.dart';
import 'package:codeware/Auth/screens/register/register.dart';
import 'package:codeware/SideBar/bloc/bloc.dart';
import 'package:codeware/theme.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';

class LoginScreen extends StatefulWidget {
  final SideBarBloc bloc;
  const LoginScreen({super.key, required this.bloc});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool passwordVisible = false;
  TextEditingController emailController = TextEditingController();
  TextEditingController passController = TextEditingController();
  final formkey = GlobalKey<FormState>();
  final double vMargin = 10.0;

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final authbloc = BlocProvider.of<LoginBloc>(context);
    return BlocConsumer<LoginBloc, LoginState>(listener: (context, state) {
      if (state is LoginErrorState) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(state.exception.toString())));
      }
      if (state is LoginSuccessState) {
        // SideBarBloc().refresh();
        widget.bloc.refresh();
        Navigator.pop(context);
      }
    }, builder: (context, state) {
      return SafeArea(
        child: Scaffold(
          body: LayoutBuilder(builder: (context, constraints) {
            return Center(
              child: Container(
                width: 500,
                decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.onSecondary,
                    borderRadius: BorderRadius.circular(15)),
                constraints: BoxConstraints(
                  maxWidth: constraints.maxWidth * 0.95,
                ),
                child: SingleChildScrollView(
                  padding: EdgeInsets.symmetric(
                    vertical: MediaQuery.of(context).size.height * 0.1,
                    horizontal: constraints.maxWidth * 0.01,
                  ),
                  child: Form(
                    key: formkey,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Log In!",
                          style: Theme.of(context).textTheme.displayMedium,
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        Text(
                          "Login to a world of seamless experience.",
                          style: Theme.of(context).textTheme.labelSmall,
                        ),
                        const SizedBox(
                          height: 35,
                        ),
                        TextFormField(
                          controller: emailController,
                          keyboardType: TextInputType.emailAddress,
                          decoration: inputTheme.copyWith(
                            hintText: "Email",
                            prefixIcon: const Icon(Icons.email_outlined),
                          ),
                          validator: (value) {
                            bool emailValid = RegExp(
                                    r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                                .hasMatch("${value!}@jecrc.ac.in");
                            if (!emailValid) {
                              return ("Please enter a valid email");
                            } else {
                              return null;
                            }
                          },
                        ),
                        const SizedBox(
                          height: 18,
                        ),
                        TextFormField(
                          controller: passController,
                          obscureText: !passwordVisible,
                          enableSuggestions: false,
                          autocorrect: false,
                          decoration: inputTheme.copyWith(
                            hintText: "Password",
                            prefixIcon: const Icon(Icons.lock_outline),
                            suffixIcon: IconButton(
                              icon: Icon(
                                passwordVisible
                                    ? Icons.visibility
                                    : Icons.visibility_off,
                              ),
                              onPressed: () {
                                setState(() {
                                  passwordVisible = !passwordVisible;
                                });
                              },
                            ),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return ("Please enter a password");
                              // } else if (value.length < 6) {
                              //   return ("The Password length must be more than 6 characters");
                            }
                            return null;
                          },
                        ),
                        Padding(
                            padding: const EdgeInsets.all(13.0),
                            child: Align(
                              alignment: AlignmentDirectional.centerEnd,
                              child: TextButton(
                                onPressed: () {
                                  // Navigator.push(
                                  //   context,
                                  //   MaterialPageRoute(
                                  //     builder: (context) =>
                                  //         const ForgotPasswordScreen(),
                                  //   ),
                                  // );
                                  // authbloc.add(SwitchRoute("/forgot"));
                                },
                                child: const Text(
                                  "Forgot password?",
                                ),
                              ),
                            )),
                        const SizedBox(height: 20),
                        ElevatedButton(
                            onPressed: () {
                              // login(context);
                              if (state is! LoginLoadingState) {
                                if (formkey.currentState!.validate()) {
                                  authbloc.add(
                                    LoginRequestEvent(
                                      email: emailController.text,
                                      password: passController.text,
                                    ),
                                  );
                                }
                              }
                            },
                            child: const Text(
                              "Login",
                            )),
                        const SizedBox(
                          height: 20,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              "Don't have an account ?",
                            ),
                            // const SizedBox(width: 10),
                            TextButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => BlocProvider(
                                      create: (context) => RegisterBloc(),
                                      child: RegisterScreen(
                                        bloc: widget.bloc,
                                      ),
                                    ),
                                  ),
                                );
                              },
                              child: const Text("Register"),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      );
    });
  }
}
