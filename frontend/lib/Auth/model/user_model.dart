import 'dart:convert';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:codeware/Auth/exceptions/user_exceptions.dart';
import 'package:codeware/Auth/services/auth_service.dart';

class User {
  final int id;
  String email;
  String firstName;
  String lastName;
  String accessToken;
  String refreshToken;

  User({
    required this.id,
    required this.email,
    required this.firstName,
    required this.lastName,
    required this.accessToken,
    required this.refreshToken,
  }) {
    if (isValidRefreshToken()) {
      getNewToken();
    } else {
      throw InvalidUserException();
    }
  }

  factory User.fromJson(Map<String, dynamic> json) {
    final user = User(
      id: json['id'],
      email: json['email'],
      firstName: json['first_name'],
      lastName: json['last_name'],
      accessToken: json['access'],
      refreshToken: json['refresh'],
    );
    if (user.isValidRefreshToken()) {
      return user;
    } else {
      throw InvalidUserException();
    }
  }

  String fullName() {
    return "$firstName $lastName";
  }

  bool isValidRefreshToken() {
    final jwtData = JwtDecoder.decode(refreshToken);
    return jwtData['exp'] < DateTime.now().millisecondsSinceEpoch;
  }

  void getNewToken() async {
    final jwtData = JwtDecoder.decode(accessToken);
    await Future.delayed(
      Duration(
        milliseconds:
            jwtData['exp'] * 1000 - DateTime.now().millisecondsSinceEpoch,
      ),
      () async {
        try {
          await AuthService.refreshToken(this);
        } catch (e) {
          print(e);
        }
      },
    );
    getNewToken();
  }

  String toJson() {
    return jsonEncode(
      {
        'id': id,
        'email': email,
        'first_name': firstName,
        'last_name': lastName,
        "access": accessToken,
        "refresh": refreshToken,
      },
    );
  }
}
