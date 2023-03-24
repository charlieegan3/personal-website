package utils

import (
	"fmt"
	"hash/crc32"
)

func CRC32Hash(input []byte) string {
	return fmt.Sprintf("%d", crc32.ChecksumIEEE(input))
}
