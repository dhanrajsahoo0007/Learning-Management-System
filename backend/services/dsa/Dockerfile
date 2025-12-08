# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy shared module first
COPY services/shared /app/services/shared

# Copy dsa service
COPY services/dsa /app/services/dsa

# Build the dsa service
WORKDIR /app/services/dsa
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/services/dsa/main .

# Expose port
EXPOSE 8082

# Run the binary
CMD ["./main"]
