package utils

import (
	"fmt"
	"hash/crc32"
)

func CRC32Hash(input any) string {
	str := fmt.Sprintf("%v", input)
	return fmt.Sprintf("%d", crc32.ChecksumIEEE([]byte(str)))
}
