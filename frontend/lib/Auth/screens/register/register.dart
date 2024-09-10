import 'package:codeware/Auth/screens/register/bloc/register_bloc.dart';
import 'package:codeware/SideBar/bloc/bloc.dart';
import 'package:codeware/theme.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';

class RegisterScreen extends StatefulWidget {
  final SideBarBloc bloc;
  const RegisterScreen({super.key, required this.bloc});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  TextEditingController nameController = TextEditingController();
  TextEditingController emailController = TextEditingController();
  TextEditingController passController = TextEditingController();
  bool passwordVisible = false;
  final formkey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final authbloc = BlocProvider.of<RegisterBloc>(context);
    return BlocConsumer<RegisterBloc, RegisterState>(
        listener: (context, state) {
      if (state is RegisterErrorState) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(state.exception.toString())));
      }
      if (state is RegisterSuccessState) {
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
                      children: [
                        Text(
                          "Sign Up !",
                          style: Theme.of(context).textTheme.displayMedium,
                        ),
                        const SizedBox(
                          height: 10,
                        ),
                        Text(
                          "Register your email with us",
                          style: Theme.of(context).textTheme.labelSmall,
                        ),
                        const SizedBox(
                          height: 25,
                        ),
                        const SizedBox(
                          height: 25,
                        ),
                        TextFormField(
                          controller: nameController,
                          decoration: inputTheme.copyWith(
                            hintText: "Your Name",
                            prefixIcon: const Icon(Icons.person_outline),
                          ),
                          validator: (value) {
                            if (value!.isEmpty) {
                              return ("Please enter User name");
                            }
                            return null;
                          },
                        ),
                        const SizedBox(
                          height: 15,
                        ),
                        TextFormField(
                          controller: emailController,
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
                          height: 15,
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
                            } else if (value.length < 6) {
                              return ("The Password length must be more than 6 characters");
                            } else {
                              return null;
                            }
                          },
                        ),
                        const SizedBox(
                          height: 30,
                        ),
                        ElevatedButton(
                            onPressed: () async {
                              if (formkey.currentState!.validate()) {
                                authbloc.add(
                                  RegisterRequestEvent(
                                    email: emailController.text,
                                    password: passController.text,
                                    firstName:
                                        nameController.text.split(' ')[0],
                                    lastName:
                                        nameController.text.split(' ').last,
                                  ),
                                );
                              }
                            },
                            child: const Text(
                              "Sign Up",
                              // style: TextStyle(fontSize: 20),
                            )),
                        const SizedBox(
                          height: 15,
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              "Already have an account ?",
                            ),
                            // const SizedBox(width: 10),
                            TextButton(
                              onPressed: () {
                                Navigator.pop(context);
                              },
                              child: const Text('Login'),
                            )
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
