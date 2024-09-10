class CompilationError(Exception):
    '''Raised when an exception occurs during the compilation of 
    code to bytecode
    Attributes:
        message:str -- explanation of the error'''
    def __init__(self,cache:list[str], message="Compilation Error"):
        self.message = f"Compilation Error: {message}"
        self.cache = cache
        super().__init__(self.message)
        
class RuntimeError(Exception):
    '''Raised when an exception occurs during the compilation of 
    code to bytecode
    Attributes:
        message:str -- explanation of the error'''
    def __init__(self, message="Runtime Error"):
        self.message = message
        super().__init__(self.message)