// ignore_for_file: depend_on_referenced_packages

import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:codeware/Auth/blocs/auth/auth_bloc.dart';
import 'package:codeware/Console/bloc/bloc.dart';
// import 'package:codeware/Console/bloc/bloc.dart';
import 'package:codeware/SideBar/bloc/bloc.dart';
import 'package:codeware/TabBar/bloc/bloc.dart';
import 'package:codeware/homepage.dart';
import 'package:codeware/theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

void main() {
  runApp(const CodeWare());
}

class CodeWare extends StatefulWidget {
  const CodeWare({super.key});

  @override
  State<CodeWare> createState() => _CodeWareState();
}

class _CodeWareState extends State<CodeWare> {
  @override
  Widget build(BuildContext context) {
    return AdaptiveTheme(
      light: lightTheme(context),
      dark: darkTheme(context),
      initial: AdaptiveThemeMode.dark,
      builder: (theme, darkTheme) => MaterialApp(
          debugShowCheckedModeBanner: false,
          theme: theme,
          darkTheme: darkTheme,
          home: MultiBlocProvider(
            providers: [
              BlocProvider<AuthBloc>(
                create: (BuildContext context) => AuthBloc(),
              ),
              BlocProvider<SideBarBloc>(
                create: (BuildContext context) => SideBarBloc(),
              ),
              BlocProvider<TabBarBloc>(
                create: (BuildContext context) => TabBarBloc(),
              ),
              BlocProvider<ConsoleBloc>(
                create: (BuildContext context) => ConsoleBloc(),
              ),
            ],
            child: const HomePage(),
          )),
    );
  }
}
