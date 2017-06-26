precision mediump float;

varying vec2 v_position;

uniform sampler2D u_minimap;
uniform sampler2D u_texture;
uniform vec2 u_location;

const float tile_size = 64.0;
const float map_size = 4096.0; // 64 * 64

const float transition_tile_size = 64.0;
const float transitions_biom_width = transition_tile_size * 4.0;
const float transitions_biom_height = transitions_biom_width + transition_tile_size;
const float transitions_size = transitions_biom_width * 8.0;
const float transitions_k = transition_tile_size / transitions_size;

ivec2 biom_to_ibiom(vec4 biom) {
    return ivec2(biom.xy * 256.0);
}

vec2 ibiom_position_offset(vec2 variant, ivec2 ibiom) {
    const int bioms_per_row = int(transitions_size / transitions_biom_width);
    vec2 offset = variant * transitions_k;
    offset.x += float(ibiom.y) * (transitions_biom_width / transitions_size);
    offset.y += float(ibiom.y/bioms_per_row) * (transitions_biom_height / transitions_size);
    return offset;
}

vec2 ibiom_uv(vec2 v_position, vec2 variant, vec2 delta, ivec2 ibiom) {
    vec2 transitions_pos = ibiom_position_offset(variant, ibiom);

    vec2 p = v_position * map_size;
    p.x = mod(p.x, tile_size);
    p.y = mod(p.y, tile_size);
    p /= tile_size;
    p += delta;
    p *= transitions_k;

    return transitions_pos + p;
}

vec2 random_delta(vec2 v_position) {
    vec2 delta = vec2(0.0, 0.0);
    vec2 p = floor(v_position*map_size / tile_size) + u_location;
    float rand = sin(p.x * p.y) / 2.0; // [0 .. 1]
    if (rand > 0.3) {
        delta.y = 1.0;
    } else if (rand < -0.3) {
        delta.y = 4.0;
    }

    if (cos(p.x * p.y) > 0.0) {
        delta.x = 3.0;
    }

    return delta;
}

void main() {
    vec4 biom = texture2D(u_minimap, v_position);
    ivec2 ibiom = biom_to_ibiom(biom);
    gl_FragColor = texture2D(u_texture, ibiom_uv(v_position, vec2(0.0, 0.0), random_delta(v_position), ibiom));
}
