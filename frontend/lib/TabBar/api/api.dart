import 'package:codeware/Auth/services/auth_service.dart';
import 'package:codeware/Auth/services/helper_service.dart';
import 'package:codeware/models.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const baseUrl = "http://127.0.0.1:8000";

class TabApi {
  final CancelToken cancelToken;
  final Dio dio;
  TabApi()
      : cancelToken = CancelToken(),
        dio = Dio();

  Future<FileTab> open(int id) async {
    try {
      const String url = "$baseUrl/api/files";
      final user = await AuthService.loadUser();
      final response = await dio.get(
        url,
        queryParameters: {"file_id": id},
        cancelToken: cancelToken,
        options: Options(
          headers: HelperService.buildHeaders(
            accessToken: user.accessToken,
          ),
        ),
      );
      final data = response.data as Map;
      if (response.statusCode == 200) {
        return FileTab.fromJson(data['data']);
      } else {
        throw data["error"];
      }
    } catch (e) {
      debugPrint(e.toString());
      throw e.toString();
    }
  }

  Future<int> upload(Uint8List stream, String name) async {
    try {
      const String url = "$baseUrl/api/files";
      final user = await AuthService.loadUser();
      final response = await dio.post(
        url,
        cancelToken: cancelToken,
        options: Options(
          headers: HelperService.buildHeaders(
            accessToken: user.accessToken,
          ),
        ),
        data: {
          "name": name,
          "file": stream,
        },
      );
      final data = response.data as Map;
      if (response.statusCode == 200) {
        return data['file_id'];
      } else {
        throw data["error"];
      }
    } catch (e) {
      debugPrint(e.toString());
      throw e.toString();
    }
  }

  Future<bool> save(Uint8List stream, String name, int id) async {
    try {
      const String url = "$baseUrl/api/files";
      final user = await AuthService.loadUser();
      final response = await dio.put(
        url,
        cancelToken: cancelToken,
        options: Options(
          headers: HelperService.buildHeaders(
            accessToken: user.accessToken,
          ),
        ),
        data: {
          "file_id": id,
          "name": name,
          "file": stream,
        },
      );
      final data = response.data as Map;
      if (response.statusCode == 200) {
        return true;
      } else {
        throw data["error"];
      }
    } catch (e) {
      debugPrint(e.toString());
      throw e.toString();
    }
  }

  Future<FileTab> run() async {
    try {
      const String url = "$baseUrl/api/files";
      final token = await const FlutterSecureStorage().read(key: "token");
      final response = await dio.get(
        url,
        cancelToken: cancelToken,
        options: Options(headers: {"Authorization": "Token $token"}),
      );

      final data = response.data as Map;
      if (response.statusCode == 200) {
        return FileTab.fromJson(data['data']);
      } else {
        throw data["error"];
      }
    } catch (e) {
      debugPrint(e.toString());
      throw e.toString();
    }
  }
}
