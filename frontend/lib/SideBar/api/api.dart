import 'package:codeware/Auth/model/user_model.dart';
import 'package:codeware/Auth/services/auth_service.dart';
import 'package:codeware/Auth/services/helper_service.dart';
import 'package:codeware/models.dart';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

const baseUrl = "http://127.0.0.1:8000";

class FileApi {
  final CancelToken cancelToken;
  final Dio dio;
  FileApi()
      : cancelToken = CancelToken(),
        dio = Dio();

  Future<List<CodeFile>> get() async {
    try {
      const String url = "$baseUrl/api/files/list";
      final User user = await AuthService.loadUser();
      final response = await dio.get(
        url,
        cancelToken: cancelToken,
        options: Options(
            headers: HelperService.buildHeaders(accessToken: user.accessToken)),
      );

      final data = response.data as Map;
      if (response.statusCode == 200) {
        final List files = data['data'] as List;
        final List<CodeFile> codefiles = [];
        for (var file in files) {
          codefiles.add(CodeFile.fromJson(file));
        }
        return codefiles;
      } else {
        throw data["error"];
      }
    } catch (e) {
      debugPrint(e.toString());
      throw e.toString();
    }
  }

  Future<bool> delete(int id) async {
    try {
      const String url = "$baseUrl/api/files";
      final user = await AuthService.loadUser();
      final response = await dio.delete(
        url,
        cancelToken: cancelToken,
        options: Options(
          headers: HelperService.buildHeaders(
            accessToken: user.accessToken,
          ),
        ),
        data: {
          "file_id": id,
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

  Future<bool> rename(int id, String name) async {
    try {
      const String url = "$baseUrl/api/files";
      final user = await AuthService.loadUser();
      final response = await dio.patch(
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

  Future<FileTab> readBytes(int id) async {
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
}
