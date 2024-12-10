import os
from pathlib import Path

def scan_react_project():
    """
    Escanea un proyecto React en el directorio actual y guarda su estructura
    y contenido en un archivo txt, excluyendo directorios y archivos innecesarios.
    """
    # Directorio raíz es el directorio actual
    root_path = os.getcwd()

    # Directorios y archivos a ignorar
    IGNORE_DIRS = {
        'node_modules',
        'build',
        'dist',
        '.git',
        '.vscode',
        'coverage',
        '__pycache__',
        '.next',
        'out'
    }

    IGNORE_FILES = {
        '.DS_Store',
        '.env.local',
        '.env.development',
        '.env.test',
        '.env.production',
        'package-lock.json',
        'yarn.lock',
        '*.log',
        '*.map'
    }

    # Extensiones de archivo a incluir
    INCLUDE_EXTENSIONS = {
        '.js', '.jsx', '.ts', '.tsx', '.css', '.scss',
        '.json', '.md', '.svg', '.html', '.env'
    }

    output = []

    def should_ignore_file(file_path):
        """Verifica si un archivo debe ser ignorado"""
        file_name = os.path.basename(file_path)
        extension = os.path.splitext(file_name)[1]

        # Ignora archivos que coincidan con patrones a ignorar
        for pattern in IGNORE_FILES:
            if pattern.startswith('*.'):
                if file_name.endswith(pattern[1:]):
                    return True
            elif file_name == pattern:
                return True

        # Solo incluye archivos con extensiones permitidas
        return extension not in INCLUDE_EXTENSIONS

    def scan_directory(current_path, indent_level=0):
        """Escanea recursivamente el directorio y sus subdirectorios"""
        try:
            items = os.listdir(current_path)

            # Primero procesa los archivos
            files = [item for item in items if os.path.isfile(os.path.join(current_path, item))]
            for file_name in sorted(files):
                file_path = os.path.join(current_path, file_name)

                if should_ignore_file(file_path):
                    continue

                # Lee y guarda el contenido del archivo
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        rel_path = os.path.relpath(file_path, root_path)
                        output.append(f"\n{'='*50}")
                        output.append(f"Archivo: {rel_path}")
                        output.append(f"{'='*50}\n")
                        output.append(content)
                        output.append("\n")
                except Exception as e:
                    output.append(f"Error leyendo {file_path}: {str(e)}\n")

            # Luego procesa los directorios
            dirs = [item for item in items if os.path.isdir(os.path.join(current_path, item))]
            for dir_name in sorted(dirs):
                if dir_name in IGNORE_DIRS:
                    continue

                dir_path = os.path.join(current_path, dir_name)
                output.append(f"\nDirectorio: {os.path.relpath(dir_path, root_path)}/\n")
                scan_directory(dir_path, indent_level + 1)

        except Exception as e:
            output.append(f"Error escaneando {current_path}: {str(e)}\n")

    print(f"Escaneando proyecto React en: {root_path}")

    # Inicia el escaneo desde el directorio raíz
    output.append("ESTRUCTURA DEL PROYECTO REACT\n")
    output.append(f"Directorio raíz: {root_path}\n")
    scan_directory(root_path)

    # Guarda la salida en un archivo
    output_file = os.path.join(root_path, 'proyecto_react_estructura.txt')
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(output))
        print(f"\nArchivo generado exitosamente: {output_file}")
    except Exception as e:
        print(f"Error guardando el archivo: {str(e)}")

if __name__ == "__main__":
    scan_react_project()