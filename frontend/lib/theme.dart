import 'package:flutter/material.dart';

enum ThemeColors { orange, green, cyan, pink, blue, violet, yellow }

extension COLOR on ThemeColors {
  Color get color {
    switch (this) {
      case ThemeColors.orange:
        return const Color(0xffffded4);
      case ThemeColors.green:
        return const Color(0xffe1ecfe);
      case ThemeColors.cyan:
        return const Color(0xffd7c8ff);
      case ThemeColors.pink:
        return const Color(0xffffaefd);
      case ThemeColors.blue:
        return const Color(0xffb8d5f1);
      case ThemeColors.violet:
        return const Color(0xffd7c8ff);
      case ThemeColors.yellow:
        return const Color(0xffffdda3);
    }
  }
}

final Color accentColor = Colors.green.shade100;

ThemeData lightTheme(BuildContext context) {
  const primaryColor = Colors.black;
  // final deviceWidth = MediaQuery.of(context).size.width;
  return ThemeData(
    fontFamily: 'Nexa',
    useMaterial3: true,
    scaffoldBackgroundColor: const Color(0xfff8f8f8),
    colorScheme: ColorScheme.light(
      primary: primaryColor,
      onPrimary: Colors.white,
      secondary: Colors.grey.shade200,
      onSecondary: Colors.white,
      tertiary: const Color(0xfff8f8f8),
    ),
    appBarTheme: AppBarTheme(
      color: Colors.white,
      shadowColor: Colors.grey.shade300,
    ),
    bottomAppBarTheme: BottomAppBarTheme(
      color: Colors.white,
      shadowColor: Colors.grey.shade300,
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        textStyle: const TextStyle(fontWeight: FontWeight.bold),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        // padding: EdgeInsets.symmetric(horizontal: deviceWidth * 0.12),
        // maximumSize: Size(deviceWidth * 0.6, deviceWidth * 0.12),
        // minimumSize: Size(deviceWidth * 0.3, deviceWidth * 0.12),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    ),
    iconTheme: const IconThemeData(color: Colors.black),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      shape: CircleBorder(),
      elevation: 5,
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontFamily: 'Nexa',
        // fontWeight: FontWeight.bold,
      ),
      displayMedium: TextStyle(
        fontFamily: 'Nexa',
        // fontWeight: FontWeight.bold,
      ),
      titleLarge: TextStyle(
        fontFamily: 'Nexa',
        // fontWeight: FontWeight.bold,
      ),
      headlineSmall: TextStyle(
        fontFamily: 'Nexa',
        // fontWeight: FontWeight.w500,
      ),
    ),
    dividerColor: Colors.grey.shade700,
  );
}

ThemeData darkTheme(BuildContext context) {
  final primaryColor = Colors.grey.shade200;
  const primaryBg = Color(0xff1b1b1b);
  // final deviceWidth = MediaQuery.of(context).size.width;
  return ThemeData(
    fontFamily: 'Nexa',
    useMaterial3: true,
    colorScheme: ColorScheme.dark(
      primary: primaryColor,
      onPrimary: Colors.grey.shade900,
      secondary: Colors.grey.shade800,
      onSecondary: Colors.grey.shade900,
      // tertiary: const Color(0xff23241f),
      tertiary: const Color(0xff282c34),
      onTertiary: Colors.grey.shade400,
    ),
    appBarTheme: AppBarTheme(
      color: primaryBg,
      shadowColor: Colors.grey.shade900,
    ),
    scaffoldBackgroundColor: const Color(0xff111111),
    bottomAppBarTheme: BottomAppBarTheme(
      color: primaryBg,
      shadowColor: Colors.grey.shade900,
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        textStyle: const TextStyle(fontWeight: FontWeight.bold),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primaryColor,
        foregroundColor: Colors.grey.shade900,
        shadowColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        // padding: EdgeInsets.symmetric(horizontal: deviceWidth * 0.12),
        // maximumSize: Size(deviceWidth * 0.6, deviceWidth * 0.12),
        // minimumSize: Size(deviceWidth * 0.3, deviceWidth * 0.12),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    ),
    iconTheme: const IconThemeData(color: Colors.white),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      shape: CircleBorder(),
      elevation: 5,
    ),
    textTheme: const TextTheme(
      displayLarge: TextStyle(
        fontFamily: 'Nexa',
        // fontWeight: FontWeight.bold,
      ),
      displayMedium: TextStyle(
        fontFamily: 'Nexa',
        // fontWeight: FontWeight.bold,
      ),
      titleLarge: TextStyle(
        fontFamily: 'Nexa',
        // fontWeight: FontWeight.bold,
      ),
      headlineSmall: TextStyle(
        fontFamily: 'Nexa',
        // fontWeight: FontWeight.w500,
      ),
    ),
    dividerColor: Colors.grey.shade200,
  );
}

InputDecoration inputTheme = InputDecoration(
  // fillColor: Colors.white60,
  filled: true,
  hintStyle: const TextStyle(fontSize: 16),
  prefixStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
  // suffixIconColor: primaryColor,
  suffixStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
  errorStyle:
      TextStyle(color: Colors.red.shade400, fontWeight: FontWeight.bold),
  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
  contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 15),
  // constraints: BoxConstraints(
  //   maxWidth: deviceWidth * 0.8,
  // ),
  focusedBorder: OutlineInputBorder(
    borderRadius: BorderRadius.circular(10),
    // borderSide: BorderSide(color: primaryColor, width: 2.0),
  ),
  focusedErrorBorder: OutlineInputBorder(
    borderRadius: BorderRadius.circular(10),
    // borderSide: BorderSide(color: primaryColor, width: 2.0),
  ),
  enabledBorder: OutlineInputBorder(
    borderRadius: BorderRadius.circular(10),
    borderSide: const BorderSide(color: Colors.grey, width: 1.5),
  ),
  errorBorder: OutlineInputBorder(
    borderRadius: BorderRadius.circular(10),
    borderSide: const BorderSide(color: Colors.red, width: 1.5),
  ),
);
