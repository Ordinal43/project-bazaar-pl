<template>
    <v-card>
        <v-toolbar color="transparent" flat>
            <v-toolbar-title class="headline">
                {{ !!productId? 'Ubah Menu' : 'Menu Baru'}}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="$emit('close')">
                <v-icon>close</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-text v-if="dialogLoading" class="text-xs-center">
            <v-progress-circular
                :size="70"
                :width="7"
                color="primary"
                indeterminate
            ></v-progress-circular>
        </v-card-text>
        <v-form ref="form_new_menu" @submit.prevent="createNewMenu"
        v-show="!dialogLoading">
            <v-card-text class="text-xs-center">
                <v-slide-y-transition>
                    <v-img class="menu-img"
                        v-if="!!fileUrl"
                        :src="fileUrl"
                        max-height="200px"
                        contain
                    ></v-img>
                </v-slide-y-transition>

                <div style="height: 21px">
                    <v-slide-y-transition>
                        <div class="red--text" v-if="noImageError">
                            Gambar produk harus diupload!
                        </div>
                    </v-slide-y-transition>
                </div>

                <v-btn color="primary" outline round @click="pickFile">
                    <v-icon left>add_a_photo</v-icon>
                    Upload Gambar
                </v-btn>
                
                <input type="file"
                    ref="file"
                    name="thumbnail"
                    @change="onFileChange(
                        $event.target.name, $event.target.files)"
                    style="display:none">
            </v-card-text>
            <v-card-text>
            <v-container grid-list-lg>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-text-field
                            label="Nama menu"
                            v-model="name"
                            :rules="[rules.required]"
                            ref="name"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                        <v-textarea
                            label="Deskripsi menu"
                            v-model="description"
                            :rules="[rules.required]" 
                            rows="3"
                        ></v-textarea>
                    </v-flex>
                    <v-flex xs12 md8>
                        <v-input-number
                            label="Harga"
                            v-model="price"
                            prefix="Rp"
                            suffix="/pcs"
                            :rules="[rules.required, rules.tooMuch]"
                        ></v-input-number>
                    </v-flex>
                    <v-flex xs12 md4>
                        <v-input-number
                            label="Stok"
                            v-model="stock"
                            :rules="[rules.required, rules.tooMuch]"
                        ></v-input-number>
                    </v-flex>
                </v-layout>
            </v-container>     
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" large type="submit" :loading="btnLoading">
                    <v-icon left>
                        {{ !!productId? 'save' : 'add'}}
                    </v-icon>
                    {{ !!productId? 'simpan' : 'tambah menu'}}
                </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>
<script>
export default {
    props: {
        stand: {
            type: Number,
            required: true,
        },
        productId: {
            type: Number,
            required: true,
        },
    },
    data: () => ({
        dialogLoading: true,
        btnLoading: false,

        fileUrl: '',
        fileBin: '',
        noImageError: false,
        name: null,
        description: null,
        stock: null,
        price: null,

        rules: {
            required: v => !!v || 'Harus diisi',
            number: v => /^[0-9]*$/.test(v) || 'Angka tidak valid',
            notZero: v => v > 0 || 'Tidak boleh kurang dari 1',
            tooMuch: v => v < 999999 || 'Nilai terlalu besar!',
        },
    }),
    methods: {
        pickFile() {
            this.$refs.file.click();
        },
        onFileChange(fieldName, file) {
            let imageFile = file[0]
            if (file.length > 0) {
                let size = imageFile.size / 1024 / 1024
                if (!imageFile.type.match('image.*')) {
                    swal({
                        title: "File tidak sesuai!",
                        text: "File harus berupa gambar!",
                        icon: "error",
                        button: "Tutup",
                    });
                } else if (size>0.5) {
                    // check whether the size is greater than the size limit
                    swal({
                        title: "Ukuran tidak sesuai!",
                        text: "Ukuran gambar harus dibawah 500 KB!",
                        icon: "error",
                        button: "Tutup",
                    });
                } else {
                    this.fileUrl = URL.createObjectURL(imageFile);
                    this.fileBin = imageFile;
                    this.noImageError = false;
                    // this.copyFrom(formData);
                }
            }
        },
        async createNewMenu() {
            if(this.$refs.form_new_menu.validate() && !!this.fileUrl) {
                this.noImageError = false;
                this.btnLoading = true;
                const data = new FormData();
                data.append(`name`, this.name); 
                data.append(`price`, this.price); 
                data.append(`units`, this.stock);
                data.append(`description`, this.description);
                if(this.fileBin) {
                    data.append(`image`, this.fileBin);
                }
                data.append(`stand_id`, this.stand); 
                
                try {
                    if(!this.productId) {
                        const res = await axios.post('/api/products', data, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    } else {
                        const res = await axios.post(`/api/products/${this.productId}`, data, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    }
                    this.$emit('create_success');   
                } catch (err) {
                    console.log(err);
                }
            } else {
                this.noImageError = true;
            }
        }
    },
    async mounted() {
        if(!!this.productId) {
            const res = await axios.get(`/api/products/${this.productId}`)
            this.fileUrl = res.data.image;
            this.name = res.data.name;
            this.description = res.data.description;
            this.stock = res.data.units;
            this.price = res.data.price;
        }
        this.dialogLoading = false;
        this.$nextTick(() => this.$refs.name.focus());
    }
}
</script>
